import path from "node:path";
import { imgLint } from "./index";
import { dimensions, metadata } from "./rules";
import { ImgLintConfig } from "./types";

describe("test basic configuration", () => {
  const config: ImgLintConfig = {
    rules: [dimensions({ max: { width: 3000 } })],
  };
  test("should pass dimensions rule", async () => {
    const filename = path.join(
      __dirname,
      "../__fixtures__/dimensions-3000x2000.jpg"
    );
    await expect(imgLint(config, [filename])).resolves.not.toThrow();
  });
  test("should fail dimensions rule", async () => {
    const filename = path.join(
      __dirname,
      "../__fixtures__/dimensions-4000x3000.jpg"
    );
    await expect(imgLint(config, [filename])).rejects.toThrow();
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
    await expect(imgLint(config, [filename]));
  });
});
