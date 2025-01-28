import { basename } from "node:path";
import { ImgLintRule } from "types.js";

const name = "Filename";

type RuleConfig = {
  match: RegExp;
};

export const filename = (config: RuleConfig): ImgLintRule => {
  if (config.match) {
    const description = `Filename matches ${config.match}`;
    const test = (file: string) => {
      const valid = config.match.test(basename(file));
      if (!valid) {
        throw new Error(`Filename doesn't match ${config.match}`);
      }
    };
    return {
      name,
      test,
      description,
    };
  }
  throw new Error("Invalid rule config");
};
