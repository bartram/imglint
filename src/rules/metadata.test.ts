import { metadata } from "./metadata";
import path from "path";

describe("metadata rule", () => {
  const config = {
    key: "Marked",
    value: {
      equals: true,
    },
  };

  test("should pass metadata rule", async () => {
    const { test } = metadata(config);
    const filename = path.join(
      __dirname,
      "../../../__fixtures__/metadata-copyright.jpg"
    );
    await expect(test(filename)).resolves.not.toThrow();
  });

  test("should fail metadata rule", async () => {
    const { test } = metadata(config);
    const filename = path.join(
      __dirname,
      "../../../__fixtures__/metadata-copyright_unknown.jpg"
    );
    await expect(test(filename)).rejects.toThrow();
  });
});

describe("metadata caption rules", () => {
  const filename = path.join(
    __dirname,
    "../../../__fixtures__/metadata-caption.jpg"
  );

  test("should pass metadata caption rule", async () => {
    const config = {
      key: "description.value",
      value: {
        length: {
          min: 100,
        },
      },
    };
    const { test } = metadata(config);
    await expect(test(filename)).resolves.not.toThrow();
  });
});
