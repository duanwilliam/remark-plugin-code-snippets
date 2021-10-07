import attacher from './remark-plugin-code-snippets';
import inferLanguageAttacher from './infer-language';
import type { Plugin } from 'unified';

const plugin = attacher as Plugin & { inferLanguage: Plugin };
plugin.inferLanguage = inferLanguageAttacher;

module.exports = plugin;
