const TRANSLATIONS = {
    zh: {
        import: '\u5bfc\u5165',
        export: '\u5bfc\u51fa',
        settings: '\u8bbe\u7f6e',
        library: '\u8bcd\u5e93',
        category: '\u5206\u7c7b',
        prompt_list: '\u63d0\u793a\u8bcd\u5217\u8868',
        search_placeholder: '\u641c\u7d22\u5206\u7c7b / \u522b\u540d / \u63d0\u793a\u8bcd',
        search_short_placeholder: '\u641c\u7d22...',
        search_category_placeholder: '\u641c\u7d22\u7c7b\u522b...',
        clear_search: '\u6e05\u9664\u641c\u7d22',
        prompt_empty_error: '\u522b\u540d\u548c\u63d0\u793a\u8bcd\u4e0d\u80fd\u4e3a\u7a7a',
        add_prompt_success: '\u5df2\u6dfb\u52a0\u63d0\u793a\u8bcd',
        update_prompt_success: '\u5df2\u66f4\u65b0\u63d0\u793a\u8bcd',
        save_fail_retry: '\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5',
        delete_success: '\u5220\u9664\u6210\u529f',
        clear_category_success: '\u5206\u7c7b\u5df2\u6e05\u7a7a',
        category_exists: '\u5206\u7c7b\u5df2\u5b58\u5728',
        copy_success: '\u5df2\u590d\u5236',
        import_success: '\u5bfc\u5165\u6210\u529f',
        import_fail: '\u5bfc\u5165\u5931\u8d25',
        refresh_success: '\u5237\u65b0\u6210\u529f',
        cannot_clear_default: '\u9ed8\u8ba4\u5206\u7c7b\u4e0d\u80fd\u6e05\u7a7a',
        loading: '\u52a0\u8f7d\u4e2d...',
        no_prompts: '\u5f53\u524d\u5206\u7c7b\u4e0b\u6ca1\u6709\u63d0\u793a\u8bcd',
        load_error: '\u52a0\u8f7d\u6570\u636e\u5931\u8d25',
        save_error: '\u4fdd\u5b58\u6570\u636e\u5931\u8d25',
        edit_prompt: '\u7f16\u8f91\u63d0\u793a\u8bcd',
        add_prompt: '\u6dfb\u52a0\u63d0\u793a\u8bcd',
        alias: '\u522b\u540d',
        alias_placeholder: '\u63d0\u793a\u8bcd\u7684\u663e\u793a\u540d\u79f0',
        full_prompt: '\u5b8c\u6574\u63d0\u793a\u8bcd',
        full_prompt_placeholder: '\u8f93\u5165\u5b8c\u6574\u63d0\u793a\u8bcd\u5185\u5bb9',
        preview_image: '\u9884\u89c8\u56fe',
        save: '\u4fdd\u5b58',
        save_success: '\u4fdd\u5b58\u6210\u529f',
        cancel: '\u53d6\u6d88',
        add: '\u6dfb\u52a0',
        open_library_hint: '\u70b9\u51fb\u5de6\u4e0a\u89d2\u8bcd\u5e93\u6309\u94ae\u6253\u5f00\u63d0\u793a\u8bcd\u5e93',
        batch_operations: '\u6279\u91cf\u64cd\u4f5c',
        select_all: '\u5168\u9009',
        deselect_all: '\u5168\u4e0d\u9009',
        batch_delete: '\u6279\u91cf\u5220\u9664',
        batch_delete_confirm: '\u786e\u5b9a\u8981\u5220\u9664\u9009\u4e2d\u7684 {count} \u4e2a\u63d0\u793a\u8bcd\u5417\uff1f',
        batch_delete_success: '\u6279\u91cf\u5220\u9664\u6210\u529f',
        batch_delete_fail: '\u6279\u91cf\u5220\u9664\u5931\u8d25',
        batch_move: '\u6279\u91cf\u79fb\u52a8',
        exit_batch: '\u9000\u51fa\u6279\u91cf',
        no_matching_prompts: '\u6ca1\u6709\u5339\u914d\u7684\u63d0\u793a\u8bcd',
        add_new: '\u65b0\u589e',
        ready: '\u5c31\u7eea',
        interface: '\u754c\u9762',
        function: '\u529f\u80fd',
        language: '\u8bed\u8a00',
        separator: '\u5206\u9694\u7b26',
        separator_placeholder: '\u591a\u9009\u8f93\u51fa\u65f6\u7684\u5206\u9694\u7b26',
        theme_color: '\u4e3b\u9898\u989c\u8272',
        cannot_create_special_category: '\u4e0d\u80fd\u4f7f\u7528\u8fd9\u4e2a\u540d\u79f0\u521b\u5efa\u5206\u7c7b',
        create_subcategory: '\u521b\u5efa\u5b50\u5206\u7c7b',
        subcategory_prompt: '\u8f93\u5165\u65b0\u7684\u5b50\u5206\u7c7b\u540d\u79f0\uff1a',
        rename_category: '\u91cd\u547d\u540d\u5206\u7c7b',
        delete_category: '\u5220\u9664\u5206\u7c7b',
        delete_category_confirm: '\u786e\u5b9a\u8981\u5220\u9664\u5206\u7c7b "{category}" \u5417\uff1f',
        delete_prompt_confirm: '\u786e\u5b9a\u8981\u5220\u9664\u63d0\u793a\u8bcd "{prompt}" \u5417\uff1f',
        favorites_category: '\u6536\u85cf',
        mark_favorite: '\u6536\u85cf\u63d0\u793a\u8bcd',
        move_favorites_to_top: '\u5c06\u6536\u85cf\u9879\u7f6e\u9876',
        copy_prompt: '\u590d\u5236\u63d0\u793a\u8bcd',
        clear_category: '\u6e05\u7a7a\u5206\u7c7b',
        clear_all_confirm: '\u786e\u5b9a\u8981\u53d6\u6d88\u6240\u6709\u5df2\u9009\u63d0\u793a\u8bcd\u5417\uff1f',
        clear_category_confirm: '\u786e\u5b9a\u8981\u6e05\u7a7a\u5206\u7c7b "{category}" \u4e2d\u7684\u5168\u90e8\u63d0\u793a\u8bcd\u5417\uff1f',
        new_category_prompt: '\u8f93\u5165\u65b0\u7684\u5206\u7c7b\u540d\u79f0\uff08\u53ef\u7528 / \u521b\u5efa\u5c42\u7ea7\uff09\uff1a',
        side_preview_title: '\u9884\u89c8',
        side_preview_empty: '\u60ac\u505c\u6216\u70b9\u51fb\u63d0\u793a\u8bcd\u540e\uff0c\u5728\u8fd9\u91cc\u663e\u793a\u9884\u89c8\u56fe\u548c\u5b8c\u6574\u63d0\u793a\u8bcd',
        side_preview_no_image: '\u8be5\u63d0\u793a\u8bcd\u6ca1\u6709\u9884\u89c8\u56fe',
        collapse_preview: '\u6536\u8d77\u9884\u89c8',
        expand_preview: '\u5c55\u5f00\u9884\u89c8',
        preview_panel_empty: '\u9009\u62e9\u6216\u60ac\u505c\u63d0\u793a\u8bcd\u540e\u5728\u8fd9\u91cc\u9884\u89c8',
        preview_unselected: '\u672a\u9009\u62e9\u63d0\u793a\u8bcd',
        preview_unnamed: '\u672a\u547d\u540d\u63d0\u793a\u8bcd',
        upload_preview_hint: '\u70b9\u51fb\u6216\u62d6\u62fd\u4e0a\u4f20\u9884\u89c8\u56fe',
        confirm_action: '\u786e\u8ba4\u64cd\u4f5c',
        confirm: '\u786e\u8ba4',
        clear_selection_confirm_with_children: '\u786e\u5b9a\u8981\u6e05\u7a7a\u5206\u7c7b "{category}" \u53ca\u5176\u5b50\u5206\u7c7b\u4e2d\u7684\u6240\u6709\u5df2\u9009\u9879\u5417\uff1f',
        select_target_category: '\u8bf7\u9009\u62e9\u76ee\u6807\u5206\u7c7b\uff1a',
        choose_import_categories: '\u9009\u62e9\u8981\u5bfc\u5165\u7684\u63d0\u793a\u8bcd\u7c7b\u522b',
        confirm_import: '\u786e\u8ba4\u5bfc\u5165',
        processing: '\u5904\u7406\u4e2d...',
        invalid_image_file: '\u8bf7\u9009\u62e9\u6709\u6548\u7684\u56fe\u7247\u6587\u4ef6',
        image_read_fail: '\u56fe\u7247\u8bfb\u53d6\u5931\u8d25',
        preparse_file: '\u6b63\u5728\u9884\u89e3\u6790\u6587\u4ef6...',
        favorite_move_success: '\u6536\u85cf\u8bcd\u6761\u5df2\u7f6e\u9876',
        operation_failed_retry: '\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5',
        image_upload_fail: '\u56fe\u7247\u4e0a\u4f20\u5931\u8d25',
        batch_move_success: '\u6279\u91cf\u79fb\u52a8\u6210\u529f',
        batch_move_fail: '\u6279\u91cf\u79fb\u52a8\u5931\u8d25',
        regular_category_only: '\u53ea\u80fd\u5728\u5e38\u89c4\u5206\u7c7b\u4e2d\u6267\u884c\u6b64\u64cd\u4f5c',
        no_favorites_in_category: '\u5f53\u524d\u5206\u7c7b\u6ca1\u6709\u6536\u85cf\u7684\u8bcd\u6761',
        category_name_no_slash: '\u5206\u7c7b\u540d\u4e0d\u80fd\u5305\u542b /',
        delete_category_error: '\u5220\u9664\u5206\u7c7b\u65f6\u53d1\u751f\u9519\u8bef',
        no_category_selected: '\u6ca1\u6709\u9009\u62e9\u4efb\u4f55\u5206\u7c7b',
        sync_failed_paused: '\u6570\u636e\u540c\u6b65\u5931\u8d25\uff0c\u5df2\u6682\u505c\u81ea\u52a8\u540c\u6b65',
        simplified_chinese: '\u7b80\u4f53\u4e2d\u6587',
        english: 'English'
    },
    en: {
        import: 'Import',
        export: 'Export',
        settings: 'Settings',
        library: 'Library',
        category: 'Category',
        prompt_list: 'Prompt List',
        search_placeholder: 'Search categories / aliases / prompts',
        search_short_placeholder: 'Search...',
        search_category_placeholder: 'Search categories...',
        clear_search: 'Clear search',
        prompt_empty_error: 'Alias and prompt cannot be empty',
        add_prompt_success: 'Prompt added',
        update_prompt_success: 'Prompt updated',
        save_fail_retry: 'Save failed, please try again',
        delete_success: 'Deleted successfully',
        clear_category_success: 'Category cleared',
        category_exists: 'Category already exists',
        copy_success: 'Copied',
        import_success: 'Import successful',
        import_fail: 'Import failed',
        refresh_success: 'Refresh successful',
        cannot_clear_default: 'Default category cannot be cleared',
        loading: 'Loading...',
        no_prompts: 'No prompts in this category',
        load_error: 'Failed to load data',
        save_error: 'Failed to save data',
        edit_prompt: 'Edit Prompt',
        add_prompt: 'Add Prompt',
        alias: 'Alias',
        alias_placeholder: 'Display name for the prompt',
        full_prompt: 'Full Prompt',
        full_prompt_placeholder: 'Enter the full prompt content',
        preview_image: 'Preview Image',
        save: 'Save',
        save_success: 'Saved successfully',
        cancel: 'Cancel',
        add: 'Add',
        open_library_hint: 'Click the library button in the top-left corner to open the prompt library',
        batch_operations: 'Batch Operations',
        select_all: 'Select All',
        deselect_all: 'Deselect All',
        batch_delete: 'Batch Delete',
        batch_delete_confirm: 'Delete the selected {count} prompts?',
        batch_delete_success: 'Batch delete successful',
        batch_delete_fail: 'Batch delete failed',
        batch_move: 'Batch Move',
        exit_batch: 'Exit Batch',
        no_matching_prompts: 'No matching prompts',
        add_new: 'Add New',
        ready: 'Ready',
        interface: 'Interface',
        function: 'Function',
        language: 'Language',
        separator: 'Separator',
        separator_placeholder: 'Separator used when outputting multi-select prompts',
        theme_color: 'Theme Color',
        cannot_create_special_category: 'This category name is not allowed',
        create_subcategory: 'Create Subcategory',
        subcategory_prompt: 'Enter the new subcategory name:',
        rename_category: 'Rename Category',
        delete_category: 'Delete Category',
        delete_category_confirm: 'Delete category "{category}"?',
        delete_prompt_confirm: 'Delete prompt "{prompt}"?',
        favorites_category: 'Favorites',
        mark_favorite: 'Favorite Prompt',
        move_favorites_to_top: 'Move Favorites to Top',
        copy_prompt: 'Copy Prompt',
        clear_category: 'Clear Category',
        clear_all_confirm: 'Clear all selected prompts?',
        clear_category_confirm: 'Clear all prompts in category "{category}"?',
        new_category_prompt: 'Enter a new category name (use / for hierarchy):',
        side_preview_title: 'Preview',
        side_preview_empty: 'Hover or click a prompt to show its preview image and full prompt here',
        side_preview_no_image: 'This prompt has no preview image',
        collapse_preview: 'Collapse Preview',
        expand_preview: 'Expand Preview',
        preview_panel_empty: 'Select or hover a prompt to preview it here',
        preview_unselected: 'No prompt selected',
        preview_unnamed: 'Unnamed Prompt',
        upload_preview_hint: 'Click or drag an image here to upload a preview',
        confirm_action: 'Confirm Action',
        confirm: 'Confirm',
        clear_selection_confirm_with_children: 'Clear all selected items in category "{category}" and its subcategories?',
        select_target_category: 'Please select a target category:',
        choose_import_categories: 'Choose the prompt categories to import',
        confirm_import: 'Confirm Import',
        processing: 'Processing...',
        invalid_image_file: 'Please choose a valid image file',
        image_read_fail: 'Failed to read image',
        preparse_file: 'Pre-parsing file...',
        favorite_move_success: 'Favorites moved to the top',
        operation_failed_retry: 'Operation failed, please try again',
        image_upload_fail: 'Image upload failed',
        batch_move_success: 'Batch move successful',
        batch_move_fail: 'Batch move failed',
        regular_category_only: 'This action is only available in regular categories',
        no_favorites_in_category: 'There are no favorite prompts in this category',
        category_name_no_slash: 'Category names cannot contain /',
        delete_category_error: 'An error occurred while deleting the category',
        no_category_selected: 'No category selected',
        sync_failed_paused: 'Data sync failed and automatic sync has been paused',
        simplified_chinese: 'Simplified Chinese',
        english: 'English'
    }
};

function normalizeLanguage(language) {
    const value = String(language || 'zh').toLowerCase();
    if (value.startsWith('en')) return 'en';
    return 'zh';
}

function createLogger(componentName) {
    const prefix = `[${componentName}]`;
    return {
        info: (...args) => console.info(prefix, ...args),
        warn: (...args) => console.warn(prefix, ...args),
        error: (...args) => console.error(prefix, ...args),
    };
}

const toastManagerProxy = {
    showToast(message, type = 'info', duration = 3000) {
        const doc = document;
        let container = doc.querySelector('.dps-toast-container');
        if (!container) {
            container = doc.createElement('div');
            container.className = 'dps-toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '100000',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            });
            doc.body.appendChild(container);
        }
        const toast = doc.createElement('div');
        const bg = type === 'error' ? '#6b1d1d' : type === 'success' ? '#183d27' : '#21364f';
        Object.assign(toast.style, {
            minWidth: '180px',
            maxWidth: '360px',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: bg,
            color: '#f3f6fb',
            fontSize: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.28)',
        });
        toast.textContent = String(message || '');
        container.appendChild(toast);
        setTimeout(() => toast.remove(), Math.max(1200, Number(duration) || 3000));
    }
};

const globalMultiLanguageManager = {
    _language: 'zh',
    t(key) {
        const shortKey = String(key || '').split('.').pop();
        const language = normalizeLanguage(this._language);
        const current = TRANSLATIONS[language] || TRANSLATIONS.zh;
        if (Object.prototype.hasOwnProperty.call(current, shortKey)) {
            return current[shortKey];
        }
        if (Object.prototype.hasOwnProperty.call(TRANSLATIONS.zh, shortKey)) {
            return TRANSLATIONS.zh[shortKey];
        }
        return shortKey;
    },
    getLanguage() {
        return normalizeLanguage(this._language);
    },
    setLanguage(language) {
        this._language = normalizeLanguage(language);
    },
};

class AutocompleteUI {
    constructor({ inputElement }) {
        this.inputElement = inputElement;
    }
    destroy() {}
}

export { AutocompleteUI, toastManagerProxy, globalMultiLanguageManager, createLogger };
