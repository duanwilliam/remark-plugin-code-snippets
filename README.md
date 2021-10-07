# remark-plugin-code-snippets

Remark plugin for creating sourcing code snippets from local files.

## Installation

```bash
# npm
npm install remark-plugin-code-snippets

# yarn
yarn add remark-plugin-code-snippets
```

## Options

| Option | Type | Default | Description |
| :-: | :-: | :-: | :-- |
| `basePath` | `string` |  | base path for sourcing files. If not defined, sources files relative to the file they're referenced from. |
| `normalizeIndent` | `bool` | `true` | normalize snippets to smallest indentation level while keeping relative indentation intact |

### `basePath`

If specified, `basePath` should be relative to the project root; file paths are then sourced relative to `basePath`. If not specified, files paths are sourced relative to the file they're referenced from

### `trim`

Leading and trailing lines of purely whitespace can be trimmed out based on how this option is configured.

### `normalizeIndent`

Code snippets can have their indentation normalized in the code block while retaining relative indentation. This is particularly useful when sourcing only sections of a file.

Warning: may have unexpected behavior in the case of a mix of both tabs and spaces.

## Syntax

### Basic Usage

Source a file into a code block using `file="path/to/file/from/basepath"` in the metastring of the code block.
Both single quotes and double quotes can be used, but they must match and one of them must be present.

    # valid
    ```md file='README.md'
    ```

    # also valid
    ```md file="README.md"
    ```

### Embedding with other text

All instances of the string `{{ FILE }}` in the code block's contents are replaced by the file contents. This string must be on its own line, with nothing else but leading and/or trailing whitespace.

### Sourcing parts of a file

Append `:#-#` to specify a range of lines to source from the file, rather than the entirety of the file. Leading zeros are not recognized. To source only a single line, omit the ending `-#`. To source from a line to the end of the file, omit the ending `#`.

    ```js file="index.js":2
    ```

    ```js file="index.js":2-3

    {{ FILE:1 }}
    {{ FILE }}
    {{ FILE:4- }}
    ```

### Inferring language

Use the `require('remark-plugin-code-snippets).inferLanguage` Remark plugin to be able to specify the file to be sourced in the node's language and infer the syntax highlighting for it based on the file extension.