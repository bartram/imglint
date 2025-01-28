import { globSync } from "node:fs";
import path from "node:path";
import { imgLint } from "./index.js";
import { filename } from "./rules/filename.js";
import { dimensions, metadata } from "./rules/index.js";
import { ImgLintConfig, ImgLintOutput } from "./types.js";

const hasError = (output: ImgLintOutput) =>
  Object.values(output).some(({ results }) =>
    results.some((result) => result.error)
  );

describe("test basic configuration", () => {
  const config: ImgLintConfig = {
    rules: [dimensions({ max: { width: 3000 } })],
  };
  test("should pass dimensions rule", async () => {
    const filename = path.join(
      __dirname,
      "../__fixtures__/dimensions-3000x2000.jpg"
    );
    const result = await imgLint(config, [filename]);
    expect(hasError(result)).toBe(false);
  });
  test("should fail dimensions rule", async () => {
    const filename = path.join(
      __dirname,
      "../__fixtures__/dimensions-4000x3000.jpg"
    );
    const result = await imgLint(config, [filename]);
    expect(hasError(result)).toBe(true);
  });
});

describe("test complex configuration", () => {
  const config: ImgLintConfig = {
    rules: [
      dimensions({ max: { width: 400 } }),
      metadata({ key: "description.value", value: { length: { min: 100 } } }),
    ],
  };
  test("should pass config", async () => {
    const filename = path.join(
      __dirname,
      "../__fixtures__/metadata-caption.jpg"
    );
    const result = await imgLint(config, [filename]);
    expect(hasError(result)).toBe(false);
  });
});

describe("test filename rule", async () => {
  it("should pass filename rule", async () => {
    const config: ImgLintConfig = {
      rules: [filename({ match: /^(.+)\.jpg$/i })],
    };
    const result = await imgLint(
      config,
      globSync(path.join(__dirname, "../__fixtures__/*.jpg"))
    );
    expect(hasError(result)).toBe(false);
  });
});
