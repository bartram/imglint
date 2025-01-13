import sizeOf from "image-size";
import { ImgLintRule } from "../../types";

export type Dimensions = { width: number; height: number; aspectRatio: number };

export type LimitRuleConfig = Partial<{
  min: Partial<Dimensions> | number;
  max: Partial<Dimensions> | number;
  exact: Partial<Dimensions>;
}>;

export type FnRuleConfig = (dimensions: Dimensions) => boolean;

export type RuleConfig =
  | Partial<Dimensions> // shorthand for exact
  | LimitRuleConfig
  | FnRuleConfig;

type TestFn = (sourceValue: number, targetValue: number) => boolean;

export const isNumber = (config?: unknown): config is number => {
  return typeof config === "number";
};

export const isDimensions = (
  config?: unknown
): config is Partial<Dimensions> => {
  return (
    typeof config === "object" &&
    !!config &&
    ("width" in config || "height" in config || "aspectRatio" in config)
  );
};

export const isLimitRuleConfig = (
  config?: RuleConfig
): config is LimitRuleConfig => {
  return (
    typeof config === "object" &&
    !!config &&
    ("min" in config || "max" in config || "exact" in config)
  );
};

export const testMin = (sourceValue: number, targetValue: number) => {
  return sourceValue >= targetValue;
};

export const testMax = (sourceValue: number, targetValue: number) => {
  return sourceValue <= targetValue;
};

export const testExact = (sourceValue: number, targetValue: number) => {
  return sourceValue === targetValue;
};

export const testDimensions = (
  source: Dimensions,
  target: Partial<Dimensions>,
  testFn: TestFn
): void => {
  const keys: Array<keyof Dimensions> = ["width", "height", "aspectRatio"];
  for (const key of keys) {
    if (target[key] && !testFn(source[key], target[key])) {
      throw new Error("Image dimensions are invalid");
    }
  }
};

export const testValue = (
  source: Dimensions,
  target: number,
  testFn: TestFn
) => {
  const keys: Array<keyof Dimensions> = ["width", "height"];
  for (const key of keys) {
    if (!testFn(source[key], target)) {
      throw new Error("Image dimensions are invalid");
    }
  }
};

export const getTestFn = (key: keyof LimitRuleConfig): TestFn => {
  switch (key) {
    case "min":
      return testMin;
    case "max":
      return testMax;
    case "exact":
      return testExact;
    default:
      throw new Error("Invalid rule config");
  }
};

export const dimensions = (config: RuleConfig): ImgLintRule => {
  const rule = (filename: string) => {
    const { width, height } = sizeOf(filename);
    if (!width || !height) {
      throw new Error("Unable to determine image dimensions");
    }
    const aspectRatio = width / height;
    const dimensions = { width, height, aspectRatio };
    if (typeof config === "object") {
      if (isDimensions(config)) {
        testDimensions(dimensions, config, testExact);
      } else {
        if (isLimitRuleConfig(config)) {
          const keys: Array<keyof LimitRuleConfig> = ["min", "max", "exact"];
          for (const key of keys) {
            if (key in config && config[key]) {
              const testFn = getTestFn(key);
              if (isDimensions(config[key])) {
                testDimensions(dimensions, config[key], testFn);
              } else if (isNumber(config[key])) {
                testValue(dimensions, config[key], testFn);
              } else {
                throw new Error("Invalid rule config");
              }
            }
          }
        }
      }
    } else if (typeof config === "function") {
      const valid = config({ width, height, aspectRatio });
      if (!valid) {
        throw new Error("Image dimensions are invalid");
      }
    }
  };

  if (typeof config === "object") {
    if (isDimensions(config)) {
      rule.description = `Image dimensions match ${JSON.stringify(config)}`;
    } else {
      rule.description = `Image dimensions match ${JSON.stringify(config)}`;
    }
  } else if (typeof config === "function") {
    rule.description = `Image dimensions match custom rule`;
  }

  return rule;
};
