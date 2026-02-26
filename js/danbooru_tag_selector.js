
import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

const EXT_NAME = "Comfy.DanbooruTagToolkit";
const STYLE_ID = "danbooru-tag-selector-style";
const I18N = {
    en: {
        title_integrated: "Danbooru Tag Toolkit - All-in-One",
        title_selector: "Danbooru Tag Toolkit - Selector",
        btn_lang: "EN",
        btn_refresh: "Refresh",
        btn_settings: "Settings",
        btn_clear: "Clear",
        view_split: "Split",
        view_categories: "Categories",
        view_selected: "Selected",
        panel_categories: "Categories",
        panel_hint_categories: "Click tags to select.",
        panel_selected: "Selected Category Rows",
        panel_hint_selected: "One row per category, tags joined by commas.",
        ph_search: "Search tags/category...",
        btn_all_visible: "All Visible",
        btn_none_visible: "None Visible",
        btn_all: "All",
        btn_none: "None",
        filter_all_categories: "All Categories ({count})",
        empty_no_preview_integrated: "No preview data. Check tags/config and refresh.",
        empty_no_data_selector: "No data. Run workflow then refresh.",
        empty_no_selected_rows: "No selected category rows.",
        empty_preview: "(empty)",
        meta_line: "Output tags: {output} | Selected tags: {selected} | Selected categories: {categories}",
        status_ready: "Ready.",
        status_previewing_current: "Previewing categories from current tags...",
        status_loading_last: "Loading categories from last execution...",
        status_loading_latest: "Loading latest categories...",
        status_loaded_preview: "Loaded {count} categories from current tags.",
        status_loaded_last: "Loaded {count} categories from last execution.",
        status_no_preview: "No categories from current tags/config.",
        status_no_cached: "No cached category data yet. Run workflow once.",
        status_no_data: "No category data yet. Run workflow then refresh.",
        status_failed: "Failed to load categories.",
    },
    zh: {
        title_integrated: "Danbooru 标签工具箱 - 一体化",
        title_selector: "Danbooru 标签工具箱 - 选择器",
        btn_lang: "中",
        btn_refresh: "刷新",
        btn_settings: "设置",
        btn_clear: "清空",
        view_split: "分栏",
        view_categories: "分类",
        view_selected: "已选",
        panel_categories: "分类",
        panel_hint_categories: "点击标签进行选择。",
        panel_selected: "已选分类行",
        panel_hint_selected: "每个分类一行，标签用逗号拼接。",
        ph_search: "搜索标签/分类...",
        btn_all_visible: "全选可见",
        btn_none_visible: "清空可见",
        btn_all: "全选",
        btn_none: "清空",
        filter_all_categories: "全部分类 ({count})",
        empty_no_preview_integrated: "暂无预览数据，请检查 tags/配置后刷新。",
        empty_no_data_selector: "暂无数据，请先运行工作流再刷新。",
        empty_no_selected_rows: "暂无已选分类行。",
        empty_preview: "(空)",
        meta_line: "输出标签: {output} | 已选标签: {selected} | 已选分类: {categories}",
        status_ready: "就绪。",
        status_previewing_current: "正在根据当前 tags 预览分类...",
        status_loading_last: "正在读取上次执行的分类缓存...",
        status_loading_latest: "正在加载最新分类数据...",
        status_loaded_preview: "已从当前 tags 加载 {count} 个分类。",
        status_loaded_last: "已从上次执行加载 {count} 个分类。",
        status_no_preview: "当前 tags/配置没有分类结果。",
        status_no_cached: "暂无缓存分类数据，请先运行一次工作流。",
        status_no_data: "暂无分类数据，请先运行工作流后刷新。",
        status_failed: "加载分类失败。",
    },
};

function tr(state, key, vars = {}) {
    const lang = state?.lang === "zh" ? "zh" : "en";
    const table = I18N[lang] || I18N.en;
    let text = table[key] ?? I18N.en[key] ?? key;
    text = String(text).replace(/\{(\w+)\}/g, (_, name) => String(vars?.[name] ?? `{${name}}`));
    return text;
}

function setStatus(node, key, vars = {}) {
    const state = node.__dtsState;
    if (!state?.statusEl) return;
    state.statusKey = key;
    state.statusVars = vars;
    state.statusEl.textContent = tr(state, key, vars);
}

function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        .dts-root {
            --dts-bg: linear-gradient(180deg, #16202f 0%, #0f1621 100%);
            --dts-panel: #121c2a;
            --dts-panel-2: #0e1520;
            --dts-border: #2d3d57;
            --dts-soft: #9bb0cc;
            --dts-text: #ebf3ff;
            --dts-accent: #4cc9f0;
            --dts-warm: #ffb95f;
            width: 100%;
            max-width: 980px;
            min-height: 0;
            padding: 10px;
            border: 1px solid var(--dts-border);
            border-radius: 12px;
            background: var(--dts-bg);
            color: var(--dts-text);
            box-sizing: border-box;
            position: relative;
            font-size: 12px;
            overflow: hidden;
            height: var(--dts-root-h, auto);
            display: flex;
            flex-direction: column;
        }
        .dts-head {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px;
        }
        .dts-title {
            font-weight: 700;
            font-size: 13px;
            color: #f4f8ff;
            letter-spacing: .2px;
        }
        .dts-status {
            margin-top: 2px;
            color: var(--dts-soft);
            font-size: 11px;
            min-height: 16px;
        }
        .dts-actions {
            display: flex;
            gap: 6px;
            align-items: center;
        }
        .dts-view-select {
            display: none;
            min-width: 120px;
            border: 1px solid #3d5478;
            border-radius: 8px;
            background: #0f1826;
            color: #e9f3ff;
            padding: 5px 8px;
            font-size: 11px;
        }
        .dts-btn {
            border: 1px solid #3f577a;
            border-radius: 8px;
            background: #1b2e49;
            color: #e9f2ff;
            padding: 5px 9px;
            cursor: pointer;
            font-size: 11px;
        }
        .dts-btn:hover {
            border-color: #5e7fae;
            background: #223a5b;
        }
        .dts-btn-main {
            border-color: #5d8ec7;
            background: #28557f;
        }
        .dts-btn-main:hover {
            border-color: #74ace8;
            background: #306597;
        }
        .dts-main {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 10px;
            min-height: 0;
            flex: 1 1 auto;
        }
        .dts-panel {
            border: 1px solid var(--dts-border);
            border-radius: 10px;
            background: linear-gradient(180deg, var(--dts-panel) 0%, var(--dts-panel-2) 100%);
            padding: 8px;
            min-height: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        .dts-panel-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .dts-panel-title {
            font-weight: 700;
            color: #f4f8ff;
        }
        .dts-panel-hint {
            font-size: 11px;
            color: var(--dts-soft);
        }
        .dts-tools {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 6px;
            margin-bottom: 8px;
        }
        .dts-search-wrap {
            position: relative;
        }
        .dts-search {
            width: 100%;
            border: 1px solid #3d5478;
            border-radius: 8px;
            background: #0f1826;
            color: #e9f4ff;
            outline: none;
            padding: 6px 28px 6px 9px;
            box-sizing: border-box;
        }
        .dts-search:focus {
            border-color: #6388b5;
            box-shadow: 0 0 0 2px rgba(76, 201, 240, .16);
        }
        .dts-search-clear {
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            border: none;
            background: transparent;
            color: #92a6c5;
            font-size: 14px;
            cursor: pointer;
            line-height: 1;
        }
        .dts-filter {
            min-width: 128px;
            border: 1px solid #3d5478;
            border-radius: 8px;
            background: #0f1826;
            color: #e9f3ff;
            padding: 5px 8px;
            font-size: 11px;
        }
        .dts-batch {
            display: flex;
            justify-content: flex-end;
            gap: 6px;
            margin-bottom: 8px;
        }
        .dts-categories {
            max-height: none;
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-right: 2px;
            flex: 1 1 auto;
            min-height: 120px;
        }
        .dts-category {
            border: 1px solid #304661;
            border-radius: 8px;
            background: #101d2e;
            padding: 6px;
        }
        .dts-category-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
        }
        .dts-category-name {
            font-weight: 600;
            color: #f3f8ff;
        }
        .dts-small-actions {
            display: flex;
            gap: 4px;
        }
        .dts-small {
            border: 1px solid #4a6389;
            border-radius: 6px;
            background: #172a44;
            color: #e8f1ff;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 10px;
        }
        .dts-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        .dts-tag {
            border: 1px solid #4f678e;
            border-radius: 999px;
            padding: 3px 9px;
            background: #182943;
            color: #edf4ff;
            cursor: pointer;
            user-select: none;
            line-height: 1.3;
        }
        .dts-tag:hover {
            border-color: #6a8fbd;
        }
        .dts-tag.dts-active {
            border-color: #e4a654;
            background: #3d2a16;
            color: #ffd9a5;
        }
        .dts-selected-list {
            margin: 0;
            padding: 0;
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-height: none;
            overflow: auto;
            flex: 1 1 auto;
            min-height: 90px;
        }
        .dts-selected-cat-item {
            border: 1px solid #405a80;
            border-radius: 8px;
            background: #142741;
            padding: 6px;
            display: grid;
            grid-template-columns: 28px 1fr auto;
            gap: 6px;
            align-items: start;
        }
        .dts-selected-cat-item.dragging {
            opacity: .46;
        }
        .dts-selected-cat-item.drop-target {
            border-color: var(--dts-warm);
            box-shadow: 0 0 0 2px rgba(255, 185, 95, .2);
        }
        .dts-drag {
            width: 24px;
            height: 24px;
            border: 1px solid #5c7daf;
            border-radius: 6px;
            background: #1d3558;
            color: #edf5ff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            cursor: grab;
            margin-top: 1px;
        }
        .dts-drag:active {
            cursor: grabbing;
        }
        .dts-selected-body {
            min-width: 0;
        }
        .dts-selected-title {
            color: #f2f7ff;
            font-weight: 700;
            margin-bottom: 3px;
            font-size: 12px;
        }
        .dts-selected-line {
            color: #d6e6ff;
            line-height: 1.38;
            font-size: 11px;
            word-break: break-word;
        }
        .dts-selected-actions {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        .dts-icon {
            width: 24px;
            height: 24px;
            border: 1px solid #4b648b;
            border-radius: 6px;
            background: #193054;
            color: #dbe9ff;
            font-size: 11px;
            line-height: 1;
            cursor: pointer;
        }
        .dts-icon:hover {
            border-color: #6688b9;
            background: #203e67;
        }
        .dts-danger {
            border-color: #7f5568;
            background: #3f2332;
            color: #ffdce8;
        }
        .dts-danger:hover {
            border-color: #ab728b;
            background: #4f2b3c;
        }
        .dts-preview {
            margin-top: 8px;
            border: 1px solid #334964;
            border-radius: 8px;
            background: #0f1828;
            color: #dce9ff;
            min-height: 60px;
            padding: 8px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.4;
            flex-shrink: 0;
        }
        .dts-meta {
            margin-top: 6px;
            color: var(--dts-soft);
            font-size: 11px;
        }
        .dts-empty {
            color: #95a9c7;
            font-style: italic;
            padding: 6px 2px;
        }
        .dts-settings {
            position: absolute;
            right: 10px;
            top: 44px;
            width: 360px;
            max-height: 78vh;
            overflow: auto;
            z-index: 9;
            border: 1px solid #3b4f6d;
            border-radius: 10px;
            background: #121d2d;
            box-shadow: 0 12px 26px rgba(0, 0, 0, .38);
            padding: 10px;
        }
        .dts-hidden {
            display: none;
        }
        .dts-settings-title {
            color: #f0f7ff;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .dts-section {
            border: 1px solid #31465f;
            border-radius: 8px;
            background: #101b2b;
            padding: 8px;
            margin-bottom: 8px;
        }
        .dts-section-title {
            color: #d9e8ff;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .dts-field {
            margin-bottom: 8px;
        }
        .dts-field:last-child {
            margin-bottom: 0;
        }
        .dts-field label {
            display: block;
            color: #9fb1cb;
            font-size: 11px;
            margin-bottom: 4px;
        }
        .dts-input,
        .dts-textarea,
        .dts-settings select {
            width: 100%;
            border: 1px solid #3b5173;
            border-radius: 8px;
            background: #0f1826;
            color: #eaf3ff;
            box-sizing: border-box;
            outline: none;
            font-size: 11px;
        }
        .dts-input,
        .dts-settings select {
            padding: 6px 8px;
        }
        .dts-textarea {
            min-height: 56px;
            resize: vertical;
            padding: 7px 8px;
            line-height: 1.35;
        }
        .dts-segment {
            display: inline-flex;
            gap: 4px;
            border: 1px solid #35506f;
            border-radius: 8px;
            padding: 3px;
            background: #101b2a;
        }
        .dts-seg {
            border: 1px solid transparent;
            border-radius: 6px;
            background: transparent;
            color: #b7c8e0;
            font-size: 11px;
            padding: 3px 8px;
            cursor: pointer;
        }
        .dts-seg.active {
            border-color: #4a79a8;
            background: #23466c;
            color: #eef6ff;
        }
        .dts-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #304760;
            border-radius: 8px;
            background: #101b2b;
            padding: 6px 8px;
            margin-bottom: 6px;
            color: #c5d5ea;
            font-size: 11px;
        }
        .dts-toggle:last-child {
            margin-bottom: 0;
        }
        .dts-toggle input {
            accent-color: var(--dts-accent);
        }
        .dts-root.dts-compact .dts-main {
            grid-template-columns: 1fr;
            grid-template-rows: minmax(170px, 1fr) minmax(140px, 1fr);
        }
        .dts-root.dts-compact .dts-panel-hint {
            display: none;
        }
        .dts-root.dts-compact .dts-view-select {
            display: inline-block;
        }
        .dts-root.dts-compact .dts-actions {
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        .dts-root.dts-compact .dts-selected-actions {
            flex-direction: column;
        }
        @media (max-width: 760px) {
            .dts-main {
                grid-template-columns: 1fr;
            }
            .dts-settings {
                left: 10px;
                right: 10px;
                width: auto;
            }
        }
    `;
    document.head.appendChild(style);
}

function hideWidget(widget) {
    if (!widget) return;
    widget.type = "hidden";
    widget.computeSize = () => [0, -4];
    widget.draw = () => {};
}

function compactTagsInputWidget(widget) {
    if (!widget) return;
    const originalComputeSize = typeof widget.computeSize === "function" ? widget.computeSize.bind(widget) : null;
    widget.computeSize = (width) => {
        const original = originalComputeSize ? originalComputeSize(width) : [Math.max(220, width || 220), 70];
        return [original[0], 44];
    };
}

function getWidget(node, name) {
    return node.widgets?.find(w => w.name === name);
}

function getWidgetValue(node, name, fallback = "") {
    const widget = getWidget(node, name);
    if (!widget) return fallback;
    return widget.value ?? fallback;
}

function setWidgetValue(widget, value) {
    if (!widget) return;
    widget.value = value;
    if (typeof widget.callback === "function") {
        widget.callback(value);
    }
}

function normalizeSeparatorValue(rawValue) {
    const value = String(rawValue ?? "").trim().toLowerCase();
    if (value === "newline" || value === "space" || value === "comma") {
        return value;
    }
    if (value === "true" || value === "false") {
        return "comma";
    }
    return "comma";
}

function normalizeBooleanValue(rawValue, defaultValue = false) {
    if (typeof rawValue === "boolean") return rawValue;
    if (typeof rawValue === "number") return Boolean(rawValue);
    if (typeof rawValue === "string") {
        const value = rawValue.trim().toLowerCase();
        if (["1", "true", "yes", "on"].includes(value)) return true;
        if (["0", "false", "no", "off", ""].includes(value)) return false;
    }
    return defaultValue;
}

function coerceBoolWidget(widget, defaultValue) {
    if (!widget) return;
    const normalized = normalizeBooleanValue(widget.value, defaultValue);
    if (widget.value !== normalized) {
        setWidgetValue(widget, normalized);
    }
}

function sanitizeLegacyWidgetValues(node) {
    const selectedWidget = getWidget(node, "selected_tags_json");
    const separatorWidget = getWidget(node, "separator");

    if (selectedWidget) {
        const normalizedSelection = JSON.stringify(parseSelected(selectedWidget.value));
        if (String(selectedWidget.value ?? "") !== normalizedSelection) {
            setWidgetValue(selectedWidget, normalizedSelection);
        }
    }

    if (separatorWidget) {
        const normalizedSeparator = normalizeSeparatorValue(separatorWidget.value);
        if (String(separatorWidget.value ?? "") !== normalizedSeparator) {
            setWidgetValue(separatorWidget, normalizedSeparator);
        }
    }

    coerceBoolWidget(getWidget(node, "use_all_when_empty"), true);
    coerceBoolWidget(getWidget(node, "deduplicate_selected"), true);
    coerceBoolWidget(getWidget(node, "keep_trailing_comma"), true);
    coerceBoolWidget(getWidget(node, "deduplicate_tags"), false);
    coerceBoolWidget(getWidget(node, "validation"), true);
    coerceBoolWidget(getWidget(node, "force_reload"), false);
    coerceBoolWidget(getWidget(node, "is_comment"), true);
}

function parseSelected(rawValue) {
    if (!rawValue) return [];
    if (Array.isArray(rawValue)) return rawValue.map(v => String(v).trim()).filter(Boolean);
    if (typeof rawValue !== "string") return [];
    try {
        const parsed = JSON.parse(rawValue);
        if (Array.isArray(parsed)) {
            return parsed.map(v => String(v).trim()).filter(Boolean);
        }
    } catch (error) {
        console.warn("[DanbooruTagToolkit] parse selection failed:", error);
    }
    return [];
}

function normalizeTag(tag) {
    return String(tag || "").trim().toLowerCase();
}

function getInputSlot(node, name) {
    return node?.inputs?.find(input => input?.name === name) || null;
}

function getLinkRecord(linkId) {
    const links = app.graph?.links;
    if (!links || linkId == null) return null;
    if (Array.isArray(links)) return links[linkId] || null;
    return links[linkId] || null;
}

function readLinkField(linkRecord, objectKey, arrayIndex) {
    if (!linkRecord) return null;
    if (typeof linkRecord === "object" && !Array.isArray(linkRecord)) {
        return linkRecord[objectKey] ?? null;
    }
    if (Array.isArray(linkRecord)) {
        return linkRecord[arrayIndex] ?? null;
    }
    return null;
}

function getLinkedStringValue(node, inputName) {
    const input = getInputSlot(node, inputName);
    if (!input || input.link == null) return null;

    const linkRecord = getLinkRecord(input.link);
    const originId = readLinkField(linkRecord, "origin_id", 1);
    if (originId == null) return null;

    const originNode = app.graph?.getNodeById?.(originId);
    if (!originNode) return null;

    const preferredNames = ["string", "text", "prompt", "value", "tags"];
    for (const name of preferredNames) {
        const widget = originNode.widgets?.find(w => w?.name === name);
        if (typeof widget?.value === "string" && widget.value.trim()) {
            return widget.value;
        }
    }

    let longest = "";
    for (const widget of originNode.widgets || []) {
        if (typeof widget?.value === "string" && widget.value.length > longest.length) {
            longest = widget.value;
        }
    }
    return longest || null;
}

function getPreviewTagsText(node) {
    const input = getInputSlot(node, "tags");
    const isLinked = Boolean(input?.link != null);
    const linkedText = isLinked ? (getLinkedStringValue(node, "tags") || "") : "";
    const localText = String(getWidgetValue(node, "tags", "") || "");
    const previewText = isLinked ? String(linkedText || "").trim() : localText.trim();

    return {
        isLinked,
        linkedText: String(linkedText || ""),
        localText,
        previewText,
    };
}

function normalizeCategories(input) {
    const result = {};
    if (!input || typeof input !== "object") return result;
    for (const [category, tags] of Object.entries(input)) {
        if (!Array.isArray(tags)) {
            result[category] = [];
            continue;
        }
        result[category] = tags.map(t => String(t).trim()).filter(Boolean);
    }
    return result;
}

function getTagCategoryMap(categories) {
    const map = {};
    for (const [category, tags] of Object.entries(categories)) {
        for (const tag of tags) {
            const key = normalizeTag(tag);
            if (!(key in map)) {
                map[key] = category;
            }
        }
    }
    return map;
}

function getSelectedByCategory(state) {
    const selectedSet = new Set(state.selected.map(normalizeTag));
    const byCategory = {};
    for (const category of Object.keys(state.categories)) {
        const row = [];
        for (const tag of state.categories[category]) {
            if (selectedSet.has(normalizeTag(tag))) {
                row.push(tag);
            }
        }
        if (row.length) {
            byCategory[category] = row;
        }
    }
    return byCategory;
}

function updateCategoryOrderFromSelection(state) {
    const byCategory = getSelectedByCategory(state);
    const selectedCategories = Object.keys(byCategory);
    const kept = (state.categoryOrder || []).filter(cat => selectedCategories.includes(cat));
    const existing = new Set(kept);
    for (const category of Object.keys(state.categories)) {
        if (selectedCategories.includes(category) && !existing.has(category)) {
            kept.push(category);
            existing.add(category);
        }
    }
    state.categoryOrder = kept;
}

function getOrderedSelectedTags(state) {
    const byCategory = getSelectedByCategory(state);
    const tags = [];
    const seen = new Set();

    for (const category of state.categoryOrder || []) {
        const row = byCategory[category] || [];
        for (const tag of row) {
            const key = normalizeTag(tag);
            if (!seen.has(key)) {
                seen.add(key);
                tags.push(tag);
            }
        }
    }
    return tags;
}

function joinSelected(tags, separator) {
    const sepMap = { comma: ", ", newline: "\n", space: " " };
    return tags.join(sepMap[separator] || ", ");
}

function appendTrailing(text, separator, keepTrailing) {
    if (!text || !keepTrailing) return text;
    if (separator === "newline") return `${text}\n`;
    if (separator === "space") return `${text} `;
    return `${text}, `;
}

function getOutputTagsForPreview(node) {
    const state = node.__dtsState;
    if (!state) return [];

    const selectedTags = getOrderedSelectedTags(state);
    const useAllWhenEmpty = normalizeBooleanValue(getWidgetValue(node, "use_all_when_empty", true), true);
    const deduplicateSelected = normalizeBooleanValue(getWidgetValue(node, "deduplicate_selected", true), true);

    const availableMap = {};
    const allTags = [];
    for (const tags of Object.values(state.categories || {})) {
        for (const tag of tags) {
            const key = normalizeTag(tag);
            if (!(key in availableMap)) {
                availableMap[key] = tag;
                allTags.push(tag);
            }
        }
    }

    let mergedTags = [];
    if (!selectedTags.length && useAllWhenEmpty) {
        mergedTags = [...allTags];
    } else {
        for (const tag of selectedTags) {
            const key = normalizeTag(tag);
            if (key in availableMap) {
                mergedTags.push(availableMap[key]);
            }
        }
    }

    if (deduplicateSelected && mergedTags.length) {
        const seen = new Set();
        mergedTags = mergedTags.filter(tag => {
            const key = normalizeTag(tag);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    return mergedTags;
}

function buildPreview(node) {
    const state = node.__dtsState;
    if (!state) return "";

    const outputTags = getOutputTagsForPreview(node);
    const separator = normalizeSeparatorValue(getWidgetValue(node, "separator", "comma"));
    const keepTrailing = normalizeBooleanValue(getWidgetValue(node, "keep_trailing_comma", true), true);
    const prefix = String(getWidgetValue(node, "prefix_text", "") || "").trim();
    const selectedText = appendTrailing(joinSelected(outputTags, separator), separator, keepTrailing);

    if (prefix && selectedText) {
        if (separator === "newline") return `${prefix}\n${selectedText}`;
        if (separator === "space") return `${prefix} ${selectedText}`;
        return `${prefix}, ${selectedText}`;
    }
    if (prefix) return prefix;
    return selectedText;
}

function syncSelectedWidget(node, markDirty = true) {
    const state = node.__dtsState;
    if (!state?.selectedWidget) return;

    const orderedTags = getOrderedSelectedTags(state);
    setWidgetValue(state.selectedWidget, JSON.stringify(orderedTags));

    if (markDirty) {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
    }
}

function pruneSelectionByAvailability(state) {
    const available = new Set();
    for (const tags of Object.values(state.categories)) {
        for (const tag of tags) available.add(normalizeTag(tag));
    }
    state.selected = state.selected.filter(tag => available.has(normalizeTag(tag)));
}

function scheduleRefresh(node, delay = 260) {
    const state = node.__dtsState;
    if (!state) return;
    clearTimeout(state.refreshTimer);
    state.refreshTimer = setTimeout(() => refreshCategories(node), delay);
}

function applyPanelVisibility(state) {
    if (!state?.leftPanel || !state?.rightPanel) return;
    if (!state.compact) {
        state.leftPanel.style.display = "flex";
        state.rightPanel.style.display = "flex";
        return;
    }
    const mode = state.viewMode || "split";
    if (mode === "selected") {
        state.leftPanel.style.display = "none";
        state.rightPanel.style.display = "flex";
    } else if (mode === "categories") {
        state.leftPanel.style.display = "flex";
        state.rightPanel.style.display = "none";
    } else {
        state.leftPanel.style.display = "flex";
        state.rightPanel.style.display = "flex";
    }
}

function syncRootLayout(node) {
    const state = node.__dtsState;
    if (!state?.rootEl) return;

    const width = Math.max(300, Math.floor(node.size?.[0] || 640));
    const height = Math.max(240, Math.floor(node.size?.[1] || 620));
    const innerWidth = Math.max(280, width - 22);
    const innerHeight = Math.max(180, height - 52);

    state.rootEl.style.width = `${innerWidth}px`;
    state.rootEl.style.maxWidth = `${innerWidth}px`;
    state.rootEl.style.setProperty("--dts-root-h", `${innerHeight}px`);

    state.compact = width < 650 || height < 500;
    state.rootEl.classList.toggle("dts-compact", state.compact);

    if (!state.compact) {
        state.viewMode = "split";
        if (state.viewSelect) state.viewSelect.value = "split";
    } else if (!state.viewMode) {
        state.viewMode = "split";
        if (state.viewSelect) state.viewSelect.value = "split";
    }
    applyPanelVisibility(state);
}

function getFilteredCategories(state) {
    const filtered = {};
    const search = state.searchText.trim().toLowerCase();

    for (const [category, tags] of Object.entries(state.categories)) {
        if (state.categoryFilter !== "__all" && category !== state.categoryFilter) continue;

        const categoryHit = category.toLowerCase().includes(search);
        const finalTags = search
            ? (categoryHit ? tags : tags.filter(tag => tag.toLowerCase().includes(search)))
            : tags;

        if (finalTags.length) {
            filtered[category] = finalTags;
        }
    }
    return filtered;
}

function addVisibleTags(node) {
    const state = node.__dtsState;
    if (!state) return;

    const selectedSet = new Set(state.selected.map(normalizeTag));
    const filtered = getFilteredCategories(state);

    for (const tags of Object.values(filtered)) {
        for (const tag of tags) {
            const key = normalizeTag(tag);
            if (!selectedSet.has(key)) {
                selectedSet.add(key);
                state.selected.push(tag);
            }
        }
    }

    updateCategoryOrderFromSelection(state);
    syncSelectedWidget(node);
    renderAll(node);
}

function clearVisibleTags(node) {
    const state = node.__dtsState;
    if (!state) return;

    const visible = new Set();
    const filtered = getFilteredCategories(state);
    for (const tags of Object.values(filtered)) {
        for (const tag of tags) visible.add(normalizeTag(tag));
    }

    state.selected = state.selected.filter(tag => !visible.has(normalizeTag(tag)));
    updateCategoryOrderFromSelection(state);
    syncSelectedWidget(node);
    renderAll(node);
}

async function refreshCategories(node) {
    const state = node.__dtsState;
    if (!state) return;

    const previewInfo = getPreviewTagsText(node);
    const usePreview = state.isIntegrated && previewInfo.previewText.length > 0;

    setStatus(
        node,
        state.isIntegrated
            ? (usePreview ? "status_previewing_current" : "status_loading_last")
            : "status_loading_latest"
    );

    try {
        let response;
        let source = "latest";

        if (usePreview) {
            const payload = {
                node_id: String(node.id),
                tags: previewInfo.previewText,
                excel_file: String(getWidgetValue(node, "excel_file", "danbooru_tags.xlsx")),
                category_mapping: String(getWidgetValue(node, "category_mapping", "{}")),
                new_category_order: String(getWidgetValue(node, "new_category_order", "[]")),
                default_category: String(getWidgetValue(node, "default_category", "未归类词")),
                regex_blacklist: String(getWidgetValue(node, "regex_blacklist", "")),
                tag_blacklist: String(getWidgetValue(node, "tag_blacklist", "")),
                deduplicate_tags: normalizeBooleanValue(getWidgetValue(node, "deduplicate_tags", false), false),
                validation: normalizeBooleanValue(getWidgetValue(node, "validation", true), true),
                force_reload: normalizeBooleanValue(getWidgetValue(node, "force_reload", false), false),
                is_comment: normalizeBooleanValue(getWidgetValue(node, "is_comment", true), true),
            };

            response = await api.fetchApi("/danbooru_tag_picker/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            source = "preview";
        } else {
            response = await api.fetchApi(
                `/danbooru_tag_picker/latest?node_id=${encodeURIComponent(String(node.id))}`,
                { cache: "no-store" }
            );
        }

        if (!response.ok) {
            let detail = "";
            try {
                const errPayload = await response.json();
                detail = String(errPayload?.message || "");
            } catch {
                // ignore parse failures and keep status code only
            }
            throw new Error(detail ? `HTTP ${response.status}: ${detail}` : `HTTP ${response.status}`);
        }

        const payload = await response.json();
        state.categories = normalizeCategories(payload.categories || {});

        pruneSelectionByAvailability(state);
        updateCategoryOrderFromSelection(state);
        syncSelectedWidget(node, false);

        const count = Object.keys(state.categories).length;
        const statusKey = count > 0
            ? (source === "preview" ? "status_loaded_preview" : "status_loaded_last")
            : state.isIntegrated
                ? (usePreview
                    ? "status_no_preview"
                    : "status_no_cached")
                : "status_no_data";
        setStatus(node, statusKey, { count });

        renderAll(node);
    } catch (error) {
        setStatus(node, "status_failed");
        console.error("[DanbooruTagToolkit] refresh failed:", error);
    }
}

function toggleTag(node, tag) {
    const state = node.__dtsState;
    if (!state) return;

    const key = normalizeTag(tag);
    const idx = state.selected.findIndex(t => normalizeTag(t) === key);
    if (idx >= 0) state.selected.splice(idx, 1);
    else state.selected.push(tag);

    updateCategoryOrderFromSelection(state);
    syncSelectedWidget(node);
    renderAll(node);
}

function addCategoryAll(node, category) {
    const state = node.__dtsState;
    if (!state) return;

    const selectedSet = new Set(state.selected.map(normalizeTag));
    for (const tag of (state.categories[category] || [])) {
        const key = normalizeTag(tag);
        if (!selectedSet.has(key)) {
            selectedSet.add(key);
            state.selected.push(tag);
        }
    }

    updateCategoryOrderFromSelection(state);
    syncSelectedWidget(node);
    renderAll(node);
}

function clearCategory(node, category) {
    const state = node.__dtsState;
    if (!state) return;

    const removeSet = new Set((state.categories[category] || []).map(normalizeTag));
    state.selected = state.selected.filter(tag => !removeSet.has(normalizeTag(tag)));

    updateCategoryOrderFromSelection(state);
    syncSelectedWidget(node);
    renderAll(node);
}

function removeSelectedCategory(node, category) {
    clearCategory(node, category);
}

function moveCategoryOrder(state, from, to) {
    if (from === to || from < 0 || to < 0 || from >= state.categoryOrder.length || to >= state.categoryOrder.length) {
        return;
    }
    const arr = [...state.categoryOrder];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    state.categoryOrder = arr;
}

function renderCategoryFilter(node) {
    const state = node.__dtsState;
    const select = state.categorySelect;
    if (!select) return;

    const categories = Object.keys(state.categories);
    const oldValue = state.categoryFilter;

    select.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "__all";
    allOption.textContent = tr(state, "filter_all_categories", { count: categories.length });
    select.appendChild(allOption);

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = `${cat} (${state.categories[cat].length})`;
        select.appendChild(option);
    });

    state.categoryFilter = categories.includes(oldValue) ? oldValue : "__all";
    select.value = state.categoryFilter;
}

function renderCategories(node) {
    const state = node.__dtsState;
    const container = state.categoriesEl;
    container.innerHTML = "";

    renderCategoryFilter(node);
    const categories = getFilteredCategories(state);
    const names = Object.keys(categories);

    if (!names.length) {
        const empty = document.createElement("div");
        empty.className = "dts-empty";
        empty.textContent = state.isIntegrated
            ? tr(state, "empty_no_preview_integrated")
            : tr(state, "empty_no_data_selector");
        container.appendChild(empty);
        return;
    }

    const selectedSet = new Set(state.selected.map(normalizeTag));

    for (const category of names) {
        const card = document.createElement("div");
        card.className = "dts-category";

        const head = document.createElement("div");
        head.className = "dts-category-head";

        const title = document.createElement("div");
        title.className = "dts-category-name";
        title.textContent = `${category} (${categories[category].length})`;

        const actions = document.createElement("div");
        actions.className = "dts-small-actions";

        const allBtn = document.createElement("button");
        allBtn.className = "dts-small";
        allBtn.textContent = tr(state, "btn_all");
        allBtn.onclick = () => addCategoryAll(node, category);

        const noneBtn = document.createElement("button");
        noneBtn.className = "dts-small";
        noneBtn.textContent = tr(state, "btn_none");
        noneBtn.onclick = () => clearCategory(node, category);

        actions.appendChild(allBtn);
        actions.appendChild(noneBtn);

        head.appendChild(title);
        head.appendChild(actions);

        const tagsBox = document.createElement("div");
        tagsBox.className = "dts-tags";
        categories[category].forEach(tag => {
            const chip = document.createElement("span");
            chip.className = "dts-tag";
            if (selectedSet.has(normalizeTag(tag))) chip.classList.add("dts-active");
            chip.textContent = tag;
            chip.onclick = () => toggleTag(node, tag);
            tagsBox.appendChild(chip);
        });

        card.appendChild(head);
        card.appendChild(tagsBox);
        container.appendChild(card);
    }
}

function renderSelected(node) {
    const state = node.__dtsState;
    const list = state.selectedEl;
    list.innerHTML = "";

    const byCategory = getSelectedByCategory(state);
    const activeCategories = (state.categoryOrder || []).filter(cat => (byCategory[cat] || []).length > 0);

    if (!activeCategories.length) {
        const empty = document.createElement("div");
        empty.className = "dts-empty";
        empty.textContent = tr(state, "empty_no_selected_rows");
        list.appendChild(empty);
        return;
    }

    state.categoryOrder = activeCategories;

    activeCategories.forEach((category, index) => {
        const tags = byCategory[category] || [];

        const item = document.createElement("li");
        item.className = "dts-selected-cat-item";
        item.draggable = true;

        const dragHandle = document.createElement("span");
        dragHandle.className = "dts-drag";
        dragHandle.textContent = "☰";
        dragHandle.title = "Drag category row to reorder";

        const body = document.createElement("div");
        body.className = "dts-selected-body";

        const rowTitle = document.createElement("div");
        rowTitle.className = "dts-selected-title";
        rowTitle.textContent = `${category} (${tags.length})`;

        const rowText = document.createElement("div");
        rowText.className = "dts-selected-line";
        rowText.textContent = tags.join(", ");

        body.appendChild(rowTitle);
        body.appendChild(rowText);

        const actions = document.createElement("div");
        actions.className = "dts-selected-actions";

        const upBtn = document.createElement("button");
        upBtn.className = "dts-icon";
        upBtn.textContent = "↑";
        upBtn.title = "Move row up";
        upBtn.onclick = () => {
            if (index <= 0) return;
            moveCategoryOrder(state, index, index - 1);
            syncSelectedWidget(node);
            renderAll(node);
        };

        const downBtn = document.createElement("button");
        downBtn.className = "dts-icon";
        downBtn.textContent = "↓";
        downBtn.title = "Move row down";
        downBtn.onclick = () => {
            if (index >= activeCategories.length - 1) return;
            moveCategoryOrder(state, index, index + 1);
            syncSelectedWidget(node);
            renderAll(node);
        };

        const removeBtn = document.createElement("button");
        removeBtn.className = "dts-icon dts-danger";
        removeBtn.textContent = "x";
        removeBtn.title = "Clear this category";
        removeBtn.onclick = () => removeSelectedCategory(node, category);

        actions.appendChild(upBtn);
        actions.appendChild(downBtn);
        actions.appendChild(removeBtn);

        item.addEventListener("dragstart", event => {
            state.dragIndex = index;
            item.classList.add("dragging");
            event.dataTransfer.effectAllowed = "move";
        });

        item.addEventListener("dragend", () => {
            state.dragIndex = null;
            item.classList.remove("dragging");
            list.querySelectorAll(".drop-target").forEach(el => el.classList.remove("drop-target"));
        });

        item.addEventListener("dragover", event => {
            event.preventDefault();
            item.classList.add("drop-target");
            event.dataTransfer.dropEffect = "move";
        });

        item.addEventListener("dragleave", () => {
            item.classList.remove("drop-target");
        });

        item.addEventListener("drop", event => {
            event.preventDefault();
            item.classList.remove("drop-target");
            const from = state.dragIndex;
            const to = index;
            if (from == null || from === to) return;
            moveCategoryOrder(state, from, to);
            syncSelectedWidget(node);
            renderAll(node);
        });

        item.appendChild(dragHandle);
        item.appendChild(body);
        item.appendChild(actions);
        list.appendChild(item);
    });
}

function renderPreview(node) {
    const state = node.__dtsState;
    const orderedTags = getOrderedSelectedTags(state);
    const outputTags = getOutputTagsForPreview(node);
    state.previewEl.textContent = buildPreview(node) || tr(state, "empty_preview");
    state.metaEl.textContent = tr(state, "meta_line", {
        output: outputTags.length,
        selected: orderedTags.length,
        categories: (state.categoryOrder || []).length,
    });
}

function renderAll(node) {
    renderCategories(node);
    renderSelected(node);
    renderPreview(node);
}

function applyLanguage(node, rerender = true) {
    const state = node.__dtsState;
    if (!state) return;

    const refs = state.i18nRefs || {};

    if (refs.titleEl) {
        refs.titleEl.textContent = state.isIntegrated ? tr(state, "title_integrated") : tr(state, "title_selector");
    }
    if (refs.refreshBtn) refs.refreshBtn.textContent = tr(state, "btn_refresh");
    if (refs.settingsBtn) refs.settingsBtn.textContent = tr(state, "btn_settings");
    if (refs.clearBtn) refs.clearBtn.textContent = tr(state, "btn_clear");
    if (refs.leftTitle) refs.leftTitle.textContent = tr(state, "panel_categories");
    if (refs.leftHint) refs.leftHint.textContent = tr(state, "panel_hint_categories");
    if (refs.rightTitle) refs.rightTitle.textContent = tr(state, "panel_selected");
    if (refs.rightHint) refs.rightHint.textContent = tr(state, "panel_hint_selected");
    if (refs.searchInput) refs.searchInput.placeholder = tr(state, "ph_search");
    if (refs.allVisibleBtn) refs.allVisibleBtn.textContent = tr(state, "btn_all_visible");
    if (refs.noneVisibleBtn) refs.noneVisibleBtn.textContent = tr(state, "btn_none_visible");
    if (refs.langBtn) refs.langBtn.textContent = tr(state, "btn_lang");

    if (refs.viewSelect) {
        const current = state.viewMode || "split";
        refs.viewSelect.innerHTML = `
            <option value="split">${tr(state, "view_split")}</option>
            <option value="categories">${tr(state, "view_categories")}</option>
            <option value="selected">${tr(state, "view_selected")}</option>
        `;
        if (["split", "categories", "selected"].includes(current)) {
            refs.viewSelect.value = current;
        }
    }

    if (state.statusEl) {
        state.statusEl.textContent = state.statusKey
            ? tr(state, state.statusKey, state.statusVars || {})
            : tr(state, "status_ready");
    }

    if (rerender) {
        renderAll(node);
    }
}
function bindTextInput(input, widget, onChange) {
    input.addEventListener("input", () => {
        setWidgetValue(widget, input.value ?? "");
        if (onChange) onChange();
    });
}

function bindBoolInput(input, widget, onChange) {
    input.addEventListener("change", () => {
        setWidgetValue(widget, Boolean(input.checked));
        if (onChange) onChange();
    });
}

function createInputField(labelText, type = "text") {
    const field = document.createElement("div");
    field.className = "dts-field";

    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement(type === "textarea" ? "textarea" : "input");
    input.className = type === "textarea" ? "dts-textarea" : "dts-input";
    if (type !== "textarea") {
        input.type = type;
    }

    field.appendChild(label);
    field.appendChild(input);
    return { field, input };
}

function createToggleRow(labelText) {
    const row = document.createElement("label");
    row.className = "dts-toggle";
    row.innerHTML = `<span>${labelText}</span>`;
    const input = document.createElement("input");
    input.type = "checkbox";
    row.appendChild(input);
    return { row, input };
}

function createSettingsPanel(node) {
    const state = node.__dtsState;
    const panel = document.createElement("div");
    panel.className = "dts-settings dts-hidden";

    const title = document.createElement("div");
    title.className = "dts-settings-title";
    title.textContent = "Node Settings";
    panel.appendChild(title);

    const sorterSection = document.createElement("div");
    sorterSection.className = "dts-section";
    const sorterTitle = document.createElement("div");
    sorterTitle.className = "dts-section-title";
    sorterTitle.textContent = "Sorter";
    sorterSection.appendChild(sorterTitle);

    const excelField = createInputField("Excel / CSV file");
    const mapField = createInputField("Category mapping", "textarea");
    const orderField = createInputField("Category order", "textarea");
    const defaultField = createInputField("Default category");
    const regexField = createInputField("Regex blacklist");
    const tagBlacklistField = createInputField("Tag blacklist", "textarea");

    const dedupTagsRow = createToggleRow("Deduplicate tags before sort");
    const validationRow = createToggleRow("Validate category mapping");
    const reloadRow = createToggleRow("Force reload database");
    const commentRow = createToggleRow("Keep category comments");

    sorterSection.appendChild(excelField.field);
    sorterSection.appendChild(mapField.field);
    sorterSection.appendChild(orderField.field);
    sorterSection.appendChild(defaultField.field);
    sorterSection.appendChild(regexField.field);
    sorterSection.appendChild(tagBlacklistField.field);
    sorterSection.appendChild(dedupTagsRow.row);
    sorterSection.appendChild(validationRow.row);
    sorterSection.appendChild(reloadRow.row);
    sorterSection.appendChild(commentRow.row);

    const outputSection = document.createElement("div");
    outputSection.className = "dts-section";
    const outputTitle = document.createElement("div");
    outputTitle.className = "dts-section-title";
    outputTitle.textContent = "Output";
    outputSection.appendChild(outputTitle);

    const prefixField = createInputField("Prefix text", "textarea");
    outputSection.appendChild(prefixField.field);

    const sepField = document.createElement("div");
    sepField.className = "dts-field";
    const sepLabel = document.createElement("label");
    sepLabel.textContent = "Separator";
    const sepSegment = document.createElement("div");
    sepSegment.className = "dts-segment";
    const sepButtons = [];

    [["comma", "Comma"], ["newline", "Newline"], ["space", "Space"]].forEach(([value, label]) => {
        const btn = document.createElement("button");
        btn.className = "dts-seg";
        btn.dataset.value = value;
        btn.textContent = label;
        btn.onclick = () => {
            setWidgetValue(state.separatorWidget, value);
            node.setDirtyCanvas(true, true);
            app.graph?.setDirtyCanvas?.(true, true);
            syncSettingsFromWidgets(node);
            renderPreview(node);
        };
        sepButtons.push(btn);
        sepSegment.appendChild(btn);
    });

    sepField.appendChild(sepLabel);
    sepField.appendChild(sepSegment);

    const useAllRow = createToggleRow("Use all when none selected");
    const dedupeRow = createToggleRow("Deduplicate selected tags");
    const trailingRow = createToggleRow("Keep trailing separator");

    outputSection.appendChild(sepField);
    outputSection.appendChild(useAllRow.row);
    outputSection.appendChild(dedupeRow.row);
    outputSection.appendChild(trailingRow.row);

    panel.appendChild(sorterSection);
    panel.appendChild(outputSection);

    bindTextInput(excelField.input, state.excelWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindTextInput(mapField.input, state.mappingWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindTextInput(orderField.input, state.orderWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindTextInput(defaultField.input, state.defaultCategoryWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindTextInput(regexField.input, state.regexWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindTextInput(tagBlacklistField.input, state.tagBlacklistWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });

    bindBoolInput(dedupTagsRow.input, state.deduplicateTagsWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindBoolInput(validationRow.input, state.validationWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindBoolInput(reloadRow.input, state.forceReloadWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });
    bindBoolInput(commentRow.input, state.commentWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        if (state.isIntegrated) scheduleRefresh(node);
    });

    bindTextInput(prefixField.input, state.prefixWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        renderPreview(node);
    });
    bindBoolInput(useAllRow.input, state.useAllWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        renderPreview(node);
    });
    bindBoolInput(dedupeRow.input, state.dedupeWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        renderPreview(node);
    });
    bindBoolInput(trailingRow.input, state.trailingWidget, () => {
        node.setDirtyCanvas(true, true);
        app.graph?.setDirtyCanvas?.(true, true);
        renderPreview(node);
    });

    state.settingsControls = {
        excelInput: excelField.input,
        mappingInput: mapField.input,
        orderInput: orderField.input,
        defaultInput: defaultField.input,
        regexInput: regexField.input,
        blacklistInput: tagBlacklistField.input,
        dedupTagsToggle: dedupTagsRow.input,
        validationToggle: validationRow.input,
        reloadToggle: reloadRow.input,
        commentToggle: commentRow.input,
        prefixInput: prefixField.input,
        sepButtons,
        useAllToggle: useAllRow.input,
        dedupeToggle: dedupeRow.input,
        trailingToggle: trailingRow.input,
    };

    return panel;
}

function syncSettingsFromWidgets(node) {
    const state = node.__dtsState;
    if (!state?.settingsControls) return;

    const separator = normalizeSeparatorValue(getWidgetValue(node, "separator", "comma"));
    if (state.separatorWidget && state.separatorWidget.value !== separator) {
        setWidgetValue(state.separatorWidget, separator);
    }
    state.settingsControls.excelInput.value = String(getWidgetValue(node, "excel_file", "danbooru_tags.xlsx") || "");
    state.settingsControls.mappingInput.value = String(getWidgetValue(node, "category_mapping", "") || "");
    state.settingsControls.orderInput.value = String(getWidgetValue(node, "new_category_order", "") || "");
    state.settingsControls.defaultInput.value = String(getWidgetValue(node, "default_category", "未归类词") || "");
    state.settingsControls.regexInput.value = String(getWidgetValue(node, "regex_blacklist", "") || "");
    state.settingsControls.blacklistInput.value = String(getWidgetValue(node, "tag_blacklist", "") || "");

    state.settingsControls.dedupTagsToggle.checked = normalizeBooleanValue(getWidgetValue(node, "deduplicate_tags", false), false);
    state.settingsControls.validationToggle.checked = normalizeBooleanValue(getWidgetValue(node, "validation", true), true);
    state.settingsControls.reloadToggle.checked = normalizeBooleanValue(getWidgetValue(node, "force_reload", false), false);
    state.settingsControls.commentToggle.checked = normalizeBooleanValue(getWidgetValue(node, "is_comment", true), true);

    state.settingsControls.prefixInput.value = String(getWidgetValue(node, "prefix_text", "") || "");
    state.settingsControls.useAllToggle.checked = normalizeBooleanValue(getWidgetValue(node, "use_all_when_empty", true), true);
    state.settingsControls.dedupeToggle.checked = normalizeBooleanValue(getWidgetValue(node, "deduplicate_selected", true), true);
    state.settingsControls.trailingToggle.checked = normalizeBooleanValue(getWidgetValue(node, "keep_trailing_comma", true), true);

    state.settingsControls.sepButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.value === separator);
    });
}
app.registerExtension({
    name: EXT_NAME,
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name !== "DanbooruTagSelectorNode" && nodeData.name !== "DanbooruTagSorterSelectorNode") return;

        const isIntegratedNode = nodeData.name === "DanbooruTagSorterSelectorNode";

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const result = onNodeCreated?.apply(this, arguments);
            injectStyle();

            const selectedWidget = getWidget(this, "selected_tags_json");
            const prefixWidget = getWidget(this, "prefix_text");
            const separatorWidget = getWidget(this, "separator");
            const useAllWidget = getWidget(this, "use_all_when_empty");
            const dedupeWidget = getWidget(this, "deduplicate_selected");
            const trailingWidget = getWidget(this, "keep_trailing_comma");

            const tagsWidget = getWidget(this, "tags");
            const excelWidget = getWidget(this, "excel_file");
            const mappingWidget = getWidget(this, "category_mapping");
            const orderWidget = getWidget(this, "new_category_order");
            const defaultCategoryWidget = getWidget(this, "default_category");
            const regexWidget = getWidget(this, "regex_blacklist");
            const tagBlacklistWidget = getWidget(this, "tag_blacklist");
            const deduplicateTagsWidget = getWidget(this, "deduplicate_tags");
            const validationWidget = getWidget(this, "validation");
            const forceReloadWidget = getWidget(this, "force_reload");
            const commentWidget = getWidget(this, "is_comment");

            sanitizeLegacyWidgetValues(this);

            [selectedWidget, prefixWidget, separatorWidget, useAllWidget, dedupeWidget, trailingWidget].forEach(hideWidget);
            if (isIntegratedNode) {
                [
                    excelWidget,
                    mappingWidget,
                    orderWidget,
                    defaultCategoryWidget,
                    regexWidget,
                    tagBlacklistWidget,
                    deduplicateTagsWidget,
                    validationWidget,
                    forceReloadWidget,
                    commentWidget,
                ].forEach(hideWidget);
                compactTagsInputWidget(tagsWidget);
            }

            const root = document.createElement("div");
            root.className = "dts-root";

            const head = document.createElement("div");
            head.className = "dts-head";

            const headLeft = document.createElement("div");
            const title = document.createElement("div");
            title.className = "dts-title";
            title.textContent = isIntegratedNode ? "Danbooru Tag Toolkit - All-in-One" : "Danbooru Tag Toolkit - Selector";
            const statusEl = document.createElement("div");
            statusEl.className = "dts-status";
            statusEl.textContent = "Ready.";
            headLeft.appendChild(title);
            headLeft.appendChild(statusEl);

            const actionBox = document.createElement("div");
            actionBox.className = "dts-actions";
            const viewSelect = document.createElement("select");
            viewSelect.className = "dts-view-select";
            viewSelect.innerHTML = `
                <option value="split">Split</option>
                <option value="categories">Categories</option>
                <option value="selected">Selected</option>
            `;
            const refreshBtn = document.createElement("button");
            refreshBtn.className = "dts-btn dts-btn-main";
            refreshBtn.textContent = "Refresh";
            const settingsBtn = document.createElement("button");
            settingsBtn.className = "dts-btn";
            settingsBtn.textContent = "Settings";
            const clearBtn = document.createElement("button");
            clearBtn.className = "dts-btn";
            clearBtn.textContent = "Clear";
            const langBtn = document.createElement("button");
            langBtn.className = "dts-btn";
            langBtn.textContent = "EN";
            actionBox.appendChild(viewSelect);
            actionBox.appendChild(langBtn);
            actionBox.appendChild(refreshBtn);
            actionBox.appendChild(settingsBtn);
            actionBox.appendChild(clearBtn);

            head.appendChild(headLeft);
            head.appendChild(actionBox);
            root.appendChild(head);

            const main = document.createElement("div");
            main.className = "dts-main";

            const leftPanel = document.createElement("div");
            leftPanel.className = "dts-panel";
            const leftHead = document.createElement("div");
            leftHead.className = "dts-panel-head";
            const leftTitle = document.createElement("div");
            leftTitle.className = "dts-panel-title";
            leftTitle.textContent = "Categories";
            const leftHint = document.createElement("div");
            leftHint.className = "dts-panel-hint";
            leftHint.textContent = "Click tags to select.";
            leftHead.appendChild(leftTitle);
            leftHead.appendChild(leftHint);

            const tools = document.createElement("div");
            tools.className = "dts-tools";
            const searchWrap = document.createElement("div");
            searchWrap.className = "dts-search-wrap";
            const searchInput = document.createElement("input");
            searchInput.className = "dts-search";
            searchInput.placeholder = "Search tags/category...";
            const searchClear = document.createElement("button");
            searchClear.className = "dts-search-clear";
            searchClear.textContent = "×";
            searchClear.title = "Clear search";
            searchWrap.appendChild(searchInput);
            searchWrap.appendChild(searchClear);

            const categorySelect = document.createElement("select");
            categorySelect.className = "dts-filter";
            tools.appendChild(searchWrap);
            tools.appendChild(categorySelect);

            const batch = document.createElement("div");
            batch.className = "dts-batch";
            const allVisibleBtn = document.createElement("button");
            allVisibleBtn.className = "dts-btn";
            allVisibleBtn.textContent = "All Visible";
            const noneVisibleBtn = document.createElement("button");
            noneVisibleBtn.className = "dts-btn";
            noneVisibleBtn.textContent = "None Visible";
            batch.appendChild(allVisibleBtn);
            batch.appendChild(noneVisibleBtn);

            const categoriesEl = document.createElement("div");
            categoriesEl.className = "dts-categories";

            leftPanel.appendChild(leftHead);
            leftPanel.appendChild(tools);
            leftPanel.appendChild(batch);
            leftPanel.appendChild(categoriesEl);

            const rightPanel = document.createElement("div");
            rightPanel.className = "dts-panel";
            const rightHead = document.createElement("div");
            rightHead.className = "dts-panel-head";
            const rightTitle = document.createElement("div");
            rightTitle.className = "dts-panel-title";
            rightTitle.textContent = "Selected Category Rows";
            const rightHint = document.createElement("div");
            rightHint.className = "dts-panel-hint";
            rightHint.textContent = "One row per category, tags joined by commas.";
            rightHead.appendChild(rightTitle);
            rightHead.appendChild(rightHint);

            const selectedEl = document.createElement("ul");
            selectedEl.className = "dts-selected-list";
            const previewEl = document.createElement("div");
            previewEl.className = "dts-preview";
            const metaEl = document.createElement("div");
            metaEl.className = "dts-meta";

            rightPanel.appendChild(rightHead);
            rightPanel.appendChild(selectedEl);
            rightPanel.appendChild(previewEl);
            rightPanel.appendChild(metaEl);

            main.appendChild(leftPanel);
            main.appendChild(rightPanel);
            root.appendChild(main);
            const domWidget = this.addDOMWidget("danbooru_tag_selector_ui", "div", root, { serialize: false });
            // 把 DOM 区域放在靠前位置，避免被隐藏 widget 挤出大量顶部空白
            if (Array.isArray(this.widgets)) {
                const domIndex = this.widgets.indexOf(domWidget);
                if (domIndex >= 0) {
                    this.widgets.splice(domIndex, 1);
                }
                let insertAt = 0;
                if (isIntegratedNode && tagsWidget) {
                    const tagsIndex = this.widgets.indexOf(tagsWidget);
                    if (tagsIndex >= 0) {
                        insertAt = tagsIndex + 1;
                    }
                }
                this.widgets.splice(insertAt, 0, domWidget);
            }

            this.__dtsState = {
                isIntegrated: isIntegratedNode,
                rootEl: root,
                leftPanel,
                rightPanel,
                viewSelect,
                viewMode: "split",
                compact: false,
                selectedWidget,
                prefixWidget,
                separatorWidget,
                useAllWidget,
                dedupeWidget,
                trailingWidget,
                tagsWidget,
                excelWidget,
                mappingWidget,
                orderWidget,
                defaultCategoryWidget,
                regexWidget,
                tagBlacklistWidget,
                deduplicateTagsWidget,
                validationWidget,
                forceReloadWidget,
                commentWidget,
                categories: {},
                selected: parseSelected(selectedWidget?.value),
                categoryOrder: [],
                dragIndex: null,
                settingsOpen: false,
                searchText: "",
                categoryFilter: "__all",
                statusEl,
                categorySelect,
                categoriesEl,
                selectedEl,
                previewEl,
                metaEl,
                lang: "en",
                i18nRefs: {
                    titleEl: title,
                    refreshBtn,
                    settingsBtn,
                    clearBtn,
                    langBtn,
                    viewSelect,
                    leftTitle,
                    leftHint,
                    rightTitle,
                    rightHint,
                    searchInput,
                    allVisibleBtn,
                    noneVisibleBtn,
                },
            };

            const settingsPanel = createSettingsPanel(this);
            this.__dtsState.settingsPanel = settingsPanel;
            root.appendChild(settingsPanel);
            syncSettingsFromWidgets(this);

            refreshBtn.onclick = () => refreshCategories(this);
            settingsBtn.onclick = () => {
                const state = this.__dtsState;
                state.settingsOpen = !state.settingsOpen;
                settingsPanel.classList.toggle("dts-hidden", !state.settingsOpen);
            };
            langBtn.onclick = () => {
                const state = this.__dtsState;
                state.lang = state.lang === "zh" ? "en" : "zh";
                applyLanguage(this);
            };
            clearBtn.onclick = () => {
                const state = this.__dtsState;
                state.selected = [];
                state.categoryOrder = [];
                syncSelectedWidget(this);
                renderAll(this);
            };

            searchInput.oninput = () => {
                this.__dtsState.searchText = searchInput.value || "";
                renderAll(this);
            };
            searchClear.onclick = () => {
                searchInput.value = "";
                this.__dtsState.searchText = "";
                renderAll(this);
            };
            categorySelect.onchange = () => {
                this.__dtsState.categoryFilter = categorySelect.value || "__all";
                renderAll(this);
            };
            viewSelect.onchange = () => {
                const state = this.__dtsState;
                state.viewMode = viewSelect.value || "categories";
                applyPanelVisibility(state);
            };

            allVisibleBtn.onclick = () => addVisibleTags(this);
            noneVisibleBtn.onclick = () => clearVisibleTags(this);

            updateCategoryOrderFromSelection(this.__dtsState);
            syncRootLayout(this);
            applyLanguage(this, false);
            renderAll(this);
            refreshCategories(this);
            return result;
        };

        const onExecuted = nodeType.prototype.onExecuted;
        nodeType.prototype.onExecuted = function () {
            const result = onExecuted?.apply(this, arguments);
            if (this.__dtsState) {
                syncRootLayout(this);
                refreshCategories(this);
            }
            return result;
        };

        const onConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function (info) {
            const result = onConfigure?.apply(this, [info]);
            const state = this.__dtsState;
            if (!state) return result;

            sanitizeLegacyWidgetValues(this);
            state.selected = parseSelected(state.selectedWidget?.value);
            syncSettingsFromWidgets(this);
            updateCategoryOrderFromSelection(state);
            syncRootLayout(this);
            applyLanguage(this, false);
            renderAll(this);
            return result;
        };

        const onWidgetChanged = nodeType.prototype.onWidgetChanged;
        nodeType.prototype.onWidgetChanged = function (widget, value, oldValue, event) {
            const result = onWidgetChanged?.apply(this, [widget, value, oldValue, event]);
            const state = this.__dtsState;
            if (!state) return result;

            const settingsSet = new Set([
                "selected_tags_json",
                "prefix_text",
                "separator",
                "use_all_when_empty",
                "deduplicate_selected",
                "keep_trailing_comma",
                "excel_file",
                "category_mapping",
                "new_category_order",
                "default_category",
                "regex_blacklist",
                "tag_blacklist",
                "deduplicate_tags",
                "validation",
                "force_reload",
                "is_comment",
            ]);

            if (widget?.name && settingsSet.has(widget.name)) {
                if (widget.name === "selected_tags_json") {
                    state.selected = parseSelected(state.selectedWidget?.value);
                    updateCategoryOrderFromSelection(state);
                }
                syncSettingsFromWidgets(this);
                renderPreview(this);

                if (state.isIntegrated && [
                    "excel_file",
                    "category_mapping",
                    "new_category_order",
                    "default_category",
                    "regex_blacklist",
                    "tag_blacklist",
                    "deduplicate_tags",
                    "validation",
                    "force_reload",
                    "is_comment",
                ].includes(widget.name)) {
                    scheduleRefresh(this);
                }
                return result;
            }

            if (state.isIntegrated && widget?.name === "tags") {
                scheduleRefresh(this);
            }

            return result;
        };

        const onResize = nodeType.prototype.onResize;
        nodeType.prototype.onResize = function (size) {
            const result = onResize?.apply(this, [size]);
            if (this.__dtsState) {
                syncRootLayout(this);
            }
            return result;
        };
    },
});
