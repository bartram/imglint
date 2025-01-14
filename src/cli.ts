#!/usr/bin/env node

import { Command } from "commander";
import findup from "findup-sync";
import { ImgLintConfig } from "./types";
import { imgLint } from "./index";
import { isEmpty } from "lodash-es";
import path from "path";

const program = new Command();
program.argument("[files...]", "images to lint", "./**/*.jpg");
program.option(
  "-c, --config-path <path>",
  "path to config file",
  findup(".imglint.{js,ts}") ?? ""
);
program.parse();

if (program.args.length === 0) {
  console.error("No files to lint");
  process.exit(-1);
}

const { configPath } = program.opts();

if (!configPath) {
  console.error("Unable to find imglint config file");
  process.exit(-1);
}

import(path.join(process.cwd(), configPath))
  .then(({ default: config }: { default: ImgLintConfig }) => {
    if (!config) {
      console.error("Unable to load imglint config file");
      process.exit(-1);
    } else if (isEmpty(config)) {
      console.error("Empty config file");
      process.exit(-1);
    }
    return imgLint(config, program.args);
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log("error", error);
    process.exit(-1);
  });
