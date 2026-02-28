# ComfyUI-Danbooru-Tag-Toolkit

A refactored ComfyUI custom node toolkit for Danbooru tags.

## Overview

`ComfyUI-Danbooru-Tag-Toolkit` helps you sort, select, and export Danbooru tags with a cleaner workflow:

- Sort tags into custom categories from Excel/CSV mappings
- Select tags by category with a visual selector
- Use either split workflow (recommended) or all-in-one workflow
- Support cache preview and one-click cache clear

## Included Nodes

- `DanbooruTagSorterNode` - Split Step 1: sort tags into mapped categories
- `DanbooruTagSelectorNode` - Split Step 2: visual tag/category selector
- `DanbooruTagSorterSelectorNode` - All-in-one sorter + selector
- `DanbooruTagGetterNode` - Legacy extractor node (optional, backward compatibility)
- `DanbooruTagClearCacheNode` - Clear runtime cache

## Recommended Workflows

### Split Workflow (Recommended)

1. Connect your prompt/tags source to `DanbooruTagSorterNode`.
2. Connect `TAG_BUNDLE` from sorter to `DanbooruTagSelectorNode`.
3. Use selector outputs:
   - `SELECTED_TAGS`
   - `SELECTED_WITH_PREFIX`

### All-in-One Workflow

Use `DanbooruTagSorterSelectorNode` if you prefer a single node that combines sorting and selection.

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
