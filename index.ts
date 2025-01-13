import chalk from "chalk";
import { get } from "lodash";
import { existsSync } from "node:fs";
import ora from "ora";
import { ImgLintConfig } from "./types";

export const imgLint = async (config: ImgLintConfig, files: string[]) => {
  const { options = {} } = config;
  const { abortEarly = false } = options;
  const errors = [];
  for (const file of files) {
    if (!existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    console.log(chalk.underline(file));
    if (config.rules) {
      for (const rule of config.rules) {
        const spinner = ora(rule.description).start();
        try {
          await rule(file);
          spinner.succeed();
        } catch (error) {
          spinner.fail();
          errors.push({
            file,
            rule,
            error,
          });
          // console.error(message ?? error);
          if (abortEarly) {
            throw error;
          }
        }
      }
    }
    console.log();
  }
  if (errors) {
    for (const error of errors) {
      const message = get(error, "message");
      console.error(chalk.red(message));
    }
    throw errors;
  }
};
