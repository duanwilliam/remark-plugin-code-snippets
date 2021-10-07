# `remark-plugin-code-snippets`.inferLanguage

Helper Remark plugin for `remark-plugin-code-snippets` to specify files to be sourced from in the `lang` of the code block, and infer syntax highlighting from the file extension. 

`remark-plugin-code-snippets.inferLanguage` should be used **before** `remark-plugin-code-snippets`.

## Options

| Option | Type | Default | Description |
| :-: | :-: | :-: | :-- |
| `extensions` | `{ [ext: string]: string }` | `{}` | maps file extensions to the language syntax highlighting to use for that language extension |

### `extensions`

Map of file extensions to the desired language for syntax highlighting. Only the final extension is captured, ie `a.b.c -> c`

You can configure the extension mapping with the `extensions` field in `options`. For instance, `{ mdx: md }` would make sourced files with the `.mdx` extension result in a codeblock with language `md`.
