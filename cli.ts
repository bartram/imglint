#!/usr/bin/env ts-node

import { Command } from "commander";
import findup from "findup-sync";
import { ImgLintConfig } from "./types";
import { imgLint } from ".";
import { isEmpty } from "lodash";

const program = new Command();
program.option(
  "-c, --config-path <path>",
  "path to config file",
  findup(".imglint.{js,ts}") ?? ""
);
program.argument("[files...]", "images to lint", "./**/*.jpg");
program.parse();

const { configPath } = program.opts();

if (!configPath) {
  console.error("Unable to find imglint config file");
  process.exit(-1);
}

import(configPath)
  .then(({ default: config }: { default: ImgLintConfig }) => {
    console.log(config);
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
  .catch(() => {
    process.exit(-1);
  });

// const config = require(configPath).default as ImgLintConfig;

// @todo validate config
