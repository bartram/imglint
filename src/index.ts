import chalk from "chalk";
import { existsSync } from "node:fs";
import ora from "ora";
import { ImgLintConfig } from "./types.js";
import { isEmpty } from "lodash-es";

export const imgLint = async (config: ImgLintConfig, files: string[]) => {
  const { options = {} } = config;
  const { abortEarly = false } = options;
  const errors: Record<string, unknown[]> = {};
  for (const file of files) {
    if (!existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    console.log(chalk.underline(file));
    if (config.rules) {
      for (const rule of config.rules) {
        const spinner = ora(rule.description).start();
        try {
          await rule.test(file);
          spinner.succeed();
        } catch (error: unknown) {
          spinner.fail();
          errors[file] ??= [];
          errors[file].push(error);
          if (abortEarly) {
            break;
          }
        }
      }
    }
    console.log();
  }

  if (!isEmpty(errors)) {
    console.log(chalk.bold(chalk.red("Errors")));
    for (const [filename, fileErrors] of Object.entries(errors)) {
      console.log(chalk.underline(filename));
      for (const error of fileErrors) {
        console.error(chalk.red(error));
      }
      console.log();
    }
    throw errors;
  }
};

export * from "./rules/index.js";
