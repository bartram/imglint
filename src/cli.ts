#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import findup from "findup-sync";
import { isEmpty } from "lodash-es";
import { globSync } from "node:fs";
import path from "path";
import { imgLint } from "./index.js";

const cwd = process.env.INIT_CWD ?? process.cwd();

const program = new Command();
program.argument("[files...]", "files to lint");
program.option(
  "-c, --config-file <path>",
  "path to config file",
  findup(".imglint.js", { cwd }) ?? ""
);
program.parse();

const { configFile } = program.opts();

if (!configFile) {
  console.error("Unable to find imglint config file");
  process.exit(-1);
}

const { default: config } = await import(path.resolve(cwd, configFile));

if (!config) {
  console.error("Unable to load imglint config file");
  process.exit(-1);
} else if (isEmpty(config)) {
  console.error("Empty config file");
  process.exit(-1);
}

// args take precedence over config.files
const pattern = program.args.length > 0 ? program.args : config.files;
if (!pattern || pattern.length === 0) {
  console.error("No files to lint");
  process.exit(-1);
}

const files = globSync(pattern);
if (files.length === 0) {
  console.error("No files found");
  process.exit(-1);
}

const output = await imgLint(config, files);

const errors = output.filter(({ results }) =>
  results.some(({ error }) => error)
);

if (errors.length) {
  console.log(chalk.bold(chalk.red("Errors")));
  errors.forEach(({ file, results }) => {
    console.log(chalk.underline(file));
    results.forEach(({ rule, error }) => {
      if (error) {
        console.error(chalk.red(`${rule.name}: ${error.message}`));
      }
    });
    console.log();
  });
  process.exit(-1);
}

console.log("No ImgLint errors");
process.exit(0);
