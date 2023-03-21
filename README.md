# [[bimark-cli]]

[![npm](https://img.shields.io/npm/v/bimark-cli?style=flat-square)](https://www.npmjs.com/package/bimark-cli)
![license](https://img.shields.io/github/license/DiscreteTom/bimark-cli?style=flat-square)

A cli tool to create [[bidirectional links]] between markdown files using [bimark](https://github.com/DiscreteTom/bimark).

## Installation

```bash
npm install -g bimark-cli
```

## Usage

```bash
Usage: bimark [options] <file|folder> [file|folder]...

Options:
      --help               Show help                                   [boolean]
      --version            Show version number                         [boolean]
      --da, --def-alias    Show definition alias      [boolean] [default: false]
      --db, --def-bracket  Show definition bracket    [boolean] [default: false]
      --rb, --ref-bracket  Show reference bracket     [boolean] [default: false]
      --rh, --ref-html     Render reference as HTML   [boolean] [default: false]
  -f, --filter             Filter by file suffix       [string] [default: ".md"]
  -o, --output             Output path                    [string] [default: ""]
```
