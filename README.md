# ComfyUI-Danbooru-Tag-Toolkit

A refactored ComfyUI custom node toolkit for Danbooru tags.

## Overview

`ComfyUI-Danbooru-Tag-Toolkit` helps you sort, select, and export Danbooru tags with a cleaner workflow:

- Sort tags into custom categories from Excel/CSV mappings
- Select tags by category with a visual selector
- Use all-in-one workflow in a single node
- Browse and pick Danbooru posts from a lightweight gallery node

## Included Nodes

- `DanbooruTagSorterSelectorNode` - All-in-one sorter + selector
- `DanbooruTagGalleryLiteNode` - Lightweight Danbooru post browser (outputs images + prompts)

## Recommended Workflows

Use `DanbooruTagSorterSelectorNode` directly:

1. Connect your prompt/tags source to the node input.
2. Click `Refresh` in node UI to preview categories/tags.
3. Pick categories/tags and use outputs:
   - `SELECTED_TAGS`
   - `SELECTED_WITH_PREFIX`
   - `ALL_TAGS`

Use `DanbooruTagGalleryLiteNode` directly:

1. Search Danbooru tags and click `Load`.
2. Select one or multiple posts in the gallery grid.
3. Use outputs:
   - `images`
   - `prompts`

## Installation

1. Copy this folder into your ComfyUI custom nodes directory.
2. Install requirements if needed:

```bash
pip install -r requirements.txt
```

3. Restart ComfyUI.

## Data Files

- Mapping defaults: `defaults_config.json`
- Tag database examples: `tags_database/`

You can point the node to your own Excel/CSV source file.

## Project Rename Notes

This branch/version is renamed to:

- New project name: `ComfyUI-Danbooru-Tag-Toolkit`
- Suggested GitHub repository: `https://github.com/<your-username>/ComfyUI-Danbooru-Tag-Toolkit`

## License

MIT License. See `LICENSE`.
