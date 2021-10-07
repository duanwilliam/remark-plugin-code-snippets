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
| `basePath` | `string` |  | base path for sourcing files. If not defined, sources files relative to the file they're referenced from.
| `trim` | `bool` \| `'leading'` \| `'trailing'` | `true` | Whether to trim leading and/or trailing newlines from resultant code blocks. `true` trims both leading and trailing newlines.
| `normalizeIndent` | `bool` | `true` | normalize snippets to smallest indentation level while keeping relative indentation intact
| `extensions` | `{ [ext: string]: string }` | `{}` | maps file extensions to the language syntax highlighting to use for that language extension

### `basePath`

If specified, `basePath` should be relative to the project root; file paths are then sourced relative to `basePath`. If not specified, files paths are sourced relative to the file they're referenced from

### `trim`

Leading and trailing lines of purely whitespace can be trimmed out based on how this option is configured.

### `normalizeIndent`

Code snippets can have their indentation normalized in the code block while retaining relative indentation. This is particularly useful when sourcing only sections of a file.

Warning: may have unexpected behavior in the case of a mix of both tabs and spaces.

### `extensions`

Map of file extensions to the desired language for syntax highlighting. Only the final extension is captured, ie `a.b.c -> c`

Language inference is only used when the file sourced is defined in the `lang` field of the code block.

## Syntax

### Basic Usage

Source a file into a code block using `file="path/to/file/from/basepath"` in the language or metastring of the code block. Both single quotes and double quotes work, but they must match and one of them must be present. By default, if the contents of the code block are otherwise empty, the entirety of the file is populated into the code block. If defined in the language field, the language will be inferred.

    # valid
    ```md file='README.md'
    ```

    # also valid
    ```file="README.md"
    ```

### Embedding with other text

All instances of the string `{{ FILE }}` in the code block's contents are replaced by the file contents. This string must be on its own line, with nothing else but leading and/or trailing whitespace.

**Note: if the code block contains non-whitespace content and does not contain `{{ FILE }}`, code block content will not be overwritten, and the file contents will not be used.**

### Sourcing parts of a file

Append `:#-#` to specify a range of lines to source from the file, rather than the entirety of the file. Leading zeros are not recognized. To source only a single line, omit the ending `-#`. To source from a line to the end of the file, omit the ending `#`.

    ```js file="index.js":2

    ```js file="index.js"

    {{ FILE:1 }}
    {{ FILE:2-3 }}
    {{ FILE:4- }}