import chalk from "chalk";
import { existsSync } from "node:fs";
import ora from "ora";
import { ImgLintConfig, ImgLintOutput, ImgLintResult } from "./types.js";

export const imgLint = async (
  config: ImgLintConfig,
  files: string[]
): Promise<ImgLintOutput> => {
  const { options = {} } = config;
  const { abortEarly = false } = options;
  const output: ImgLintOutput = [];
  for (const file of files) {
    const results: ImgLintResult[] = [];
    if (!existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    console.log(chalk.underline(file));
    if (config.rules) {
      for (const rule of config.rules) {
        const spinner = ora(
          `${chalk.bold(rule.name)}: ${rule.description}`
        ).start();
        try {
          await rule.test(file);
          spinner.succeed();
          results.push({ rule });
        } catch (error) {
          spinner.fail();
          if (error instanceof Error) {
            results.push({ rule, error });
          } else {
            results.push({ rule, error: new Error("Unknown error") });
            throw error;
          }
          if (abortEarly) {
            break;
          }
        }
      }
    }
    console.log();
    output.push({ file, results });
  }
  return output;
};
