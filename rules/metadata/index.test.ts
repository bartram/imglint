import { metadata } from ".";
import path from "path";

describe("metadata rule", () => {
  const config = {
    key: "Marked",
    value: {
      equals: true,
    },
  };
  const rule = metadata(config);

  test("should pass metadata rule", async () => {
    const filename = path.join(
      __dirname,
      "../../__fixtures__/metadata-copyright.jpg"
    );
    await expect(rule(filename)).resolves.not.toThrow();
  });

  test("should fail metadata rule", async () => {
    const filename = path.join(
      __dirname,
      "../../__fixtures__/metadata-copyright_unknown.jpg"
    );
    await expect(rule(filename)).rejects.toThrow();
  });
});

describe("metadata caption rules", () => {
  const filename = path.join(
    __dirname,
    "../../__fixtures__/metadata-caption.jpg"
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
    const rule = metadata(config);
    await expect(rule(filename)).resolves.not.toThrow();
  });
});
