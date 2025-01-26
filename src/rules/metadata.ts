import exifr from "exifr";
import { ImgLintRule } from "../types.js";
import { get } from "lodash-es";

type RuleConfig = {
  key: string;
  value: Partial<{
    exists: boolean;
    equals: string | number | boolean;
    match: RegExp;
    length: Partial<{
      min: number;
      max: number;
    }>;
  }>;
};

type Test = {
  callback: (value: string | number | boolean) => void;
  description: string;
};

export const metadata = (config: RuleConfig): ImgLintRule => {
  const name = "Metadata";
  const { key } = config;

  const tests: Array<Test> = [];

  if (config.value.equals) {
    const { equals: targetValue } = config.value;
    tests.push({
      callback: (value) => {
        if (targetValue !== value) {
          throw new Error(`"${key}" does not equal ${config.value.equals}`);
        }
      },
      description: `"${key}" equals ${targetValue}`,
    });
  }
  if (config.value.match) {
    const { match: targetMatch } = config.value;
    tests.push({
      callback: (value) => {
        if (!targetMatch.test(String(value))) {
          throw new Error(`"${key}" does not match ${config.value.match}`);
        }
      },
      description: `"${key}" matches ${targetMatch}`,
    });
  }
  if ("exists" in config.value) {
    const { exists: targetExists } = config.value;
    tests.push({
      callback: (value) => {
        if (targetExists === true && !value) {
          throw new Error(`"${key}" does not exist`);
        } else if (targetExists !== false && value) {
          throw new Error(`"${key}" exists`);
        }
      },
      description: `"${key}" ${targetExists ? "exists" : "does not exist"}`,
    });
  }
  if ("length" in config.value && typeof config.value.length !== "undefined") {
    const { length: targetLength } = config.value;
    tests.push({
      callback: (value) => {
        if (typeof value !== "string") {
          throw new Error(`"${key}" is not a string`);
        }
        if (
          "min" in targetLength &&
          typeof targetLength.min !== "undefined" &&
          value.length < targetLength.min
        ) {
          throw new Error(`"${key}" value is too short`);
        }
        if (
          "max" in targetLength &&
          typeof targetLength.max !== "undefined" &&
          value.length > targetLength.max
        ) {
          throw new Error(`"${key}" value is too long`);
        }
      },
      description: `${key} length is ${JSON.stringify(targetLength)} `,
    });
  }

  const test = async (file: string) => {
    const metadata = await exifr.parse(file, { xmp: true });
    const value = get(metadata, key);
    tests.forEach(({ callback }) => callback(value));
  };
  const description = tests.map(({ description }) => description).join("\n");

  return {
    name,
    test,
    description,
  };
};
