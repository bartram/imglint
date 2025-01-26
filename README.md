# ImgLint

## Description

ImgLint is a plugin-based command line tool for static analysis of image files. It includes rules to validate image dimensiopn and metadata patterns.

## Features

- Validate image dimensions
- Check metadata fields against specified patterns

## Configuration

Create an `.imglint.js` or `.imglint.ts` file in the root directory of your project, and configure the files and rules as in this example:

```
import { metadata, dimensions } from "imglint";

export default {
  files: "./images/**/*.jpg",
  rules: [
    metadata({
      key: "Marked",
      value: {
        equals: true,
      },
    }),
    dimensions({ max: { width: 3000 } }),
  ],
}
```

## Usage

The command-line tool can be run with a tool such as `npx`. If the current working directory includes an ImgLint config file, that file will be used. Otherwise, a path to the config file can be provided with the `--config-file` option. A list of files to lint can also be passed as arguments.

ImgLint will exit with a non-zero status if any file fails any rule.