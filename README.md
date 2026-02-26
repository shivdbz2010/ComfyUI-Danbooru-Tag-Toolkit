# ComfyUI-Danbooru-Tag-Toolkit

A refactored ComfyUI custom node toolkit for Danbooru tags.

## Overview

`ComfyUI-Danbooru-Tag-Toolkit` helps you sort, select, and export Danbooru tags with a cleaner workflow:

- Sort tags into custom categories from Excel/CSV mappings
- Select tags by category with an integrated visual selector
- Keep workflow-compatible packer/extractor style nodes
- Support cache preview and one-click cache clear

## Included Nodes

- `DanbooruTagSorterNode` - Sort tags into mapped categories (Packer)
- `DanbooruTagGetterNode` - Extract sorted category outputs (Extractor)
- `DanbooruTagSelectorNode` - Visual tag/category selector (Picker)
- `DanbooruTagSorterSelectorNode` - All-in-one sorter + selector
- `DanbooruTagClearCacheNode` - Clear runtime cache

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
