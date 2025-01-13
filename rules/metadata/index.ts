import exifr from "exifr";
import { ImgLintRule } from "../../types";
import { get } from "lodash";

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

export const metadata = (config: RuleConfig): ImgLintRule => {
  const { key } = config;
  const rule = async (file: string) => {
    const metadata = await exifr.parse(file, { xmp: true });
    const value = get(metadata, key);
    if (config.value.equals) {
      if (config.value.equals !== value) {
        throw new Error(`"${key}" does not equal ${config.value.equals}`);
      }
    }
    if (config.value.match) {
      if (!config.value.match.test(value)) {
        console.log(value, config.value.match);
        throw new Error(`"${key}" does not match ${config.value.match}`);
      }
    }
    if ("exists" in config.value) {
      if (config.value.exists === true && !value) {
        throw new Error(`"${key}" value does not exist`);
      } else if (config.value.exists !== false && value) {
        throw new Error(`"${key}" exists`);
      }
    }
    if (
      "length" in config.value &&
      typeof config.value.length !== "undefined"
    ) {
      if (typeof value !== "string") {
        throw new Error(`"${key}" is not a string`);
      }
      if (
        "min" in config.value.length &&
        typeof config.value.length.min !== "undefined" &&
        value.length < config.value.length.min
      ) {
        throw new Error(`"${key}" value is too short`);
      }
      if (
        "max" in config.value &&
        typeof config.value.length.max !== "undefined" &&
        value.length > config.value.length.max
      ) {
        throw new Error(`"${key}" value is too long`);
      }
    }
  };

  if (config.value.exists) {
    rule.description = `"${key}" ${
      config.value.exists ? "exists" : "does not exist"
    }`;
  } else if (config.value.equals) {
    rule.description = `"${key}" equals ${config.value.equals}`;
  }

  return rule;
};
