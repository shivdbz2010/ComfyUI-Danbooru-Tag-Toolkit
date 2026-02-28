# ComfyUI-Danbooru-Tag-Toolkit

Danbooru tag workflow tools for ComfyUI.

This project provides:
- an all-in-one node for tag sorting + visual selection
- a lightweight Danbooru gallery node for selecting images and prompt lists

## Features

- Category-based tag sorting from Excel/CSV tag database
- Fully configurable category mapping and output order
- Visual picker for category/tag selection inside the node
- Works with both direct text input and linked upstream tag sources
- Danbooru gallery search with autocomplete
- Multi-select output from gallery (`images` + `prompts` list)
- Cache controls for gallery performance (`Clear Cache` button)

## Included Nodes

- `Danbooru Tag Toolkit - All-in-One` (`DanbooruTagSorterSelectorNode`)
  - Outputs:
  - `SELECTED_TAGS`
  - `SELECTED_WITH_PREFIX`
  - `ALL_TAGS`

- `Danbooru Tag Toolkit - Danbooru Gallery Lite` (`DanbooruTagGalleryLiteNode`)
  - Outputs:
  - `images` (list)
  - `prompts` (list)

## Installation

1. Copy this repository folder into your ComfyUI `custom_nodes` directory.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Restart ComfyUI.

## Quick Start

### 1) All-in-One Node

1. Add `Danbooru Tag Toolkit - All-in-One`.
2. Connect or type tags into `tags`.
3. Click `Refresh` to preview categories.
4. Select categories/tags in the UI.
5. Use one of the three text outputs depending on your workflow.

### 2) Gallery Lite Node

1. Add `Danbooru Tag Toolkit - Danbooru Gallery Lite`.
2. Search tags and click `Load`.
3. Select cards:
   - Click = single-select
   - `Ctrl` / `Meta` / `Shift` + click = multi-select
4. Run workflow to output selected `images` and `prompts` list.
5. Use `Clear Cache` if you want to release gallery cache immediately.

## Tag Database Format

Default database file:
- `tags_database/danbooru_tags.xlsx`

Required columns:
- `english`
- `category`
- `subcategory`

You can use your own `.xlsx` or `.csv` file by setting `excel_file`.

## Configuration Files

- `defaults_config.json`
  - `mapping`: default category mapping entries
  - `order`: default output category order

## Notes

- Gallery data is fetched from Danbooru API and requires network access.
- Very large databases increase load time and memory usage.
- The first database load is slower; following runs use in-process cache.

## License

MIT License. See `LICENSE`.
