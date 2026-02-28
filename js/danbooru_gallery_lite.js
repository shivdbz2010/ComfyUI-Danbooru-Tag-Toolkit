import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

const EXT_NAME = "Comfy.DanbooruTagGalleryLite";
const STYLE_ID = "dtg-lite-style";

function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        .dtg-root {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            background: #171717;
            border: 1px solid #303030;
            border-radius: 8px;
            color: #e8e8e8;
            font-size: 12px;
        }
        .dtg-toolbar {
            display: grid;
            grid-template-columns: 1fr 120px 90px auto auto auto;
            gap: 8px;
            align-items: center;
        }
        .dtg-input,
        .dtg-select,
        .dtg-number {
            height: 30px;
            border: 1px solid #3a3a3a;
            border-radius: 6px;
            background: #101010;
            color: #f0f0f0;
            padding: 0 8px;
            font-size: 12px;
        }
        .dtg-btn {
            height: 30px;
            border: 1px solid #3a3a3a;
            border-radius: 6px;
            background: #222;
            color: #f0f0f0;
            padding: 0 10px;
            cursor: pointer;
            font-size: 12px;
        }
        .dtg-btn:hover {
            background: #2c2c2c;
        }
        .dtg-status {
            color: #9fb6d9;
            min-height: 18px;
        }
        .dtg-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 8px;
            max-height: 420px;
            overflow: auto;
            padding-right: 2px;
        }
        .dtg-card {
            border: 1px solid #343434;
            border-radius: 8px;
            background: #121212;
            overflow: hidden;
            cursor: pointer;
        }
        .dtg-card:hover {
            border-color: #5477a7;
        }
        .dtg-card.selected {
            border-color: #7ecb7e;
            box-shadow: 0 0 0 1px #7ecb7e inset;
        }
        .dtg-thumb {
            width: 100%;
            height: 130px;
            object-fit: cover;
            display: block;
            background: #0b0b0b;
        }
        .dtg-meta {
            padding: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            color: #bdbdbd;
            font-size: 11px;
        }
        .dtg-empty {
            border: 1px dashed #3d3d3d;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: #8c8c8c;
        }
        .dtg-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #c8c8c8;
        }
    `;
    document.head.appendChild(style);
}

function getWidget(node, name) {
    return node?.widgets?.find(w => w?.name === name);
}

function hideWidget(widget) {
    if (!widget) return;
    widget.computeSize = () => [0, -4];
    widget.type = "hidden";
    widget.hidden = true;
    widget.serialize = true;
    widget.draw = () => {};
}

function parseSelectionData(rawValue) {
    const fallback = [];
    if (!rawValue || typeof rawValue !== "string") return fallback;
    try {
        const data = JSON.parse(rawValue);
        if (!data || typeof data !== "object" || !Array.isArray(data.selections)) return fallback;
        return data.selections.filter(item => item && typeof item === "object");
    } catch {
        return fallback;
    }
}

function toPrompt(tagString) {
    const tokens = String(tagString || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (!tokens.length) return "";
    return tokens.map(token => token.replaceAll("_", " ")).join(", ");
}

function normalizePost(raw) {
    const post = raw && typeof raw === "object" ? raw : {};
    return {
        id: String(post.id ?? ""),
        score: Number(post.score ?? 0),
        rating: String(post.rating ?? ""),
        preview_url: String(post.preview_url ?? ""),
        image_url: String(post.image_url ?? ""),
        tag_string: String(post.tag_string ?? ""),
        prompt: String(post.prompt ?? "") || toPrompt(post.tag_string),
    };
}

function syncSelectionWidget(node, selectionWidget, selectedMap) {
    if (!selectionWidget) return;
    const selections = Array.from(selectedMap.values());
    selectionWidget.value = JSON.stringify({ selections });
    if (typeof selectionWidget.callback === "function") {
        selectionWidget.callback(selectionWidget.value);
    }
    node?.setDirtyCanvas?.(true, true);
}

app.registerExtension({
    name: EXT_NAME,
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "DanbooruTagGalleryLiteNode") return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const result = onNodeCreated?.apply(this, arguments);
            injectStyle();

            this.setSize([860, 760]);
            const selectionWidget = getWidget(this, "selection_data");
            hideWidget(selectionWidget);

            const root = document.createElement("div");
            root.className = "dtg-root";

            const toolbar = document.createElement("div");
            toolbar.className = "dtg-toolbar";

            const searchInput = document.createElement("input");
            searchInput.className = "dtg-input";
            searchInput.placeholder = "Search tags (example: 1girl solo)";

            const ratingSelect = document.createElement("select");
            ratingSelect.className = "dtg-select";
            ratingSelect.innerHTML = `
                <option value="all">all</option>
                <option value="safe">safe</option>
                <option value="questionable">questionable</option>
                <option value="explicit">explicit</option>
            `;

            const limitInput = document.createElement("input");
            limitInput.className = "dtg-number";
            limitInput.type = "number";
            limitInput.min = "1";
            limitInput.max = "100";
            limitInput.value = "24";
            limitInput.title = "1 - 100";

            const loadBtn = document.createElement("button");
            loadBtn.className = "dtg-btn";
            loadBtn.textContent = "Load";

            const prevBtn = document.createElement("button");
            prevBtn.className = "dtg-btn";
            prevBtn.textContent = "Prev";

            const nextBtn = document.createElement("button");
            nextBtn.className = "dtg-btn";
            nextBtn.textContent = "Next";

            toolbar.appendChild(searchInput);
            toolbar.appendChild(ratingSelect);
            toolbar.appendChild(limitInput);
            toolbar.appendChild(loadBtn);
            toolbar.appendChild(prevBtn);
            toolbar.appendChild(nextBtn);

            const statusEl = document.createElement("div");
            statusEl.className = "dtg-status";
            statusEl.textContent = "Enter tags and click Load.";

            const grid = document.createElement("div");
            grid.className = "dtg-grid";

            const bottom = document.createElement("div");
            bottom.className = "dtg-bottom";
            const summaryEl = document.createElement("div");
            const clearBtn = document.createElement("button");
            clearBtn.className = "dtg-btn";
            clearBtn.textContent = "Clear Selection";
            bottom.appendChild(summaryEl);
            bottom.appendChild(clearBtn);

            root.appendChild(toolbar);
            root.appendChild(statusEl);
            root.appendChild(grid);
            root.appendChild(bottom);

            this.addDOMWidget("danbooru_gallery_lite_ui", "div", root, { serialize: false });

            const state = {
                node: this,
                selectionWidget,
                statusEl,
                summaryEl,
                searchInput,
                ratingSelect,
                limitInput,
                grid,
                page: 1,
                loading: false,
                posts: [],
                selectedMap: new Map(),
            };
            this.__dtgState = state;

            function updateSummary() {
                state.summaryEl.textContent = `Page: ${state.page} | Posts: ${state.posts.length} | Selected: ${state.selectedMap.size}`;
            }

            function saveSelection() {
                syncSelectionWidget(state.node, state.selectionWidget, state.selectedMap);
                updateSummary();
            }

            function renderPosts() {
                state.grid.innerHTML = "";
                if (!state.posts.length) {
                    const empty = document.createElement("div");
                    empty.className = "dtg-empty";
                    empty.textContent = "No posts loaded.";
                    state.grid.appendChild(empty);
                    updateSummary();
                    return;
                }

                state.posts.forEach(post => {
                    const card = document.createElement("div");
                    card.className = "dtg-card";
                    if (state.selectedMap.has(post.id)) {
                        card.classList.add("selected");
                    }

                    const img = document.createElement("img");
                    img.className = "dtg-thumb";
                    img.src = post.preview_url || "";
                    img.alt = String(post.id || "");
                    img.loading = "lazy";

                    const meta = document.createElement("div");
                    meta.className = "dtg-meta";
                    meta.innerHTML = `<span>#${post.id || "?"}</span><span>${post.rating || ""} ${post.score || 0}</span>`;

                    card.appendChild(img);
                    card.appendChild(meta);
                    card.title = post.prompt || "(empty prompt)";

                    card.onclick = () => {
                        if (state.selectedMap.has(post.id)) {
                            state.selectedMap.delete(post.id);
                            card.classList.remove("selected");
                        } else {
                            state.selectedMap.set(post.id, {
                                post_id: post.id,
                                image_url: post.image_url || post.preview_url || "",
                                preview_url: post.preview_url || "",
                                tag_string: post.tag_string || "",
                                prompt: post.prompt || "",
                            });
                            card.classList.add("selected");
                        }
                        saveSelection();
                    };

                    state.grid.appendChild(card);
                });

                updateSummary();
            }

            async function loadPosts(page) {
                if (state.loading) return;
                state.loading = true;
                state.page = Math.max(1, Number(page || 1));

                const tags = state.searchInput.value || "";
                const rating = state.ratingSelect.value || "all";
                const limit = Math.max(1, Math.min(100, Number(state.limitInput.value || 24)));
                state.limitInput.value = String(limit);

                state.statusEl.textContent = "Loading posts...";
                try {
                    const query = new URLSearchParams({
                        tags,
                        rating,
                        limit: String(limit),
                        page: String(state.page),
                    });
                    const response = await api.fetchApi(`/danbooru_tag_gallery/posts?${query.toString()}`, { cache: "no-store" });
                    if (!response.ok) {
                        let detail = "";
                        try {
                            const payload = await response.json();
                            detail = String(payload?.message || "");
                        } catch {
                            // ignore parse errors
                        }
                        throw new Error(detail || `HTTP ${response.status}`);
                    }
                    const payload = await response.json();
                    const posts = Array.isArray(payload?.posts) ? payload.posts : [];
                    state.posts = posts.map(normalizePost).filter(p => p.id);
                    state.statusEl.textContent = `Loaded ${state.posts.length} posts.`;
                    renderPosts();
                } catch (error) {
                    state.posts = [];
                    renderPosts();
                    state.statusEl.textContent = `Load failed: ${error?.message || "unknown error"}`;
                } finally {
                    state.loading = false;
                }
            }

            const restored = parseSelectionData(selectionWidget?.value);
            restored.forEach(item => {
                const key = String(item.post_id ?? "");
                if (!key) return;
                state.selectedMap.set(key, item);
            });
            updateSummary();

            loadBtn.onclick = () => loadPosts(1);
            prevBtn.onclick = () => loadPosts(Math.max(1, state.page - 1));
            nextBtn.onclick = () => loadPosts(state.page + 1);
            clearBtn.onclick = () => {
                state.selectedMap.clear();
                saveSelection();
                renderPosts();
            };
            searchInput.addEventListener("keydown", event => {
                if (event.key === "Enter") loadPosts(1);
            });

            renderPosts();
            return result;
        };

        const onConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function (info) {
            const result = onConfigure?.apply(this, [info]);
            const state = this.__dtgState;
            if (!state) return result;

            const restored = parseSelectionData(state.selectionWidget?.value);
            state.selectedMap.clear();
            restored.forEach(item => {
                const key = String(item.post_id ?? "");
                if (!key) return;
                state.selectedMap.set(key, item);
            });
            syncSelectionWidget(state.node, state.selectionWidget, state.selectedMap);
            return result;
        };
    },
});

