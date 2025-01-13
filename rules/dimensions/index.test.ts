import {
  dimensions,
  Dimensions,
  RuleConfig,
  testDimensions,
  testExact,
  testMax,
  testMin,
  testValue,
} from ".";
import path from "node:path";

suite("test helper functions", () => {
  const dimensions: Dimensions = {
    width: 3000,
    height: 2000,
    aspectRatio: 1.5,
  };

  test("test min helper function", () => {
    expect(() =>
      testDimensions(dimensions, { width: 2999 }, testMin)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 1999 }, testMin)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.4 }, testMin)
    ).not.toThrow();

    expect(() =>
      testDimensions(dimensions, { width: 3000 }, testMin)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 2000 }, testMin)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.5 }, testMin)
    ).not.toThrow();

    expect(() =>
      testDimensions(dimensions, { width: 3001 }, testMin)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 2001 }, testMin)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.6 }, testMin)
    ).toThrow();

    expect(() => testValue(dimensions, 1999, testMin)).not.toThrow();
    expect(() => testValue(dimensions, 2000, testMin)).not.toThrow();
    expect(() => testValue(dimensions, 3000, testMin)).toThrow();
    expect(() => testValue(dimensions, 3001, testMin)).toThrow();
  });

  test("test max helper function", () => {
    expect(() =>
      testDimensions(dimensions, { width: 2999 }, testMax)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 1999 }, testMax)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.4 }, testMax)
    ).toThrow();

    expect(() =>
      testDimensions(dimensions, { width: 3000 }, testMax)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 2000 }, testMax)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.5 }, testMax)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { width: 3000, height: 2000 }, testMax)
    ).not.toThrow();

    expect(() =>
      testDimensions(dimensions, { width: 3001 }, testMax)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 2001 }, testMax)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.6 }, testMax)
    ).not.toThrow();

    expect(() => testValue(dimensions, 1999, testMax)).toThrow();
    expect(() => testValue(dimensions, 2000, testMax)).toThrow();
    expect(() => testValue(dimensions, 3000, testMax)).not.toThrow();
    expect(() => testValue(dimensions, 3001, testMax)).not.toThrow();
  });

  test("testExact helper function", () => {
    expect(() =>
      testDimensions(dimensions, { width: 2999 }, testExact)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 1999 }, testExact)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.4 }, testExact)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { width: 3000, height: 999 }, testExact)
    ).toThrow();

    expect(() =>
      testDimensions(dimensions, { width: 3000 }, testExact)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 2000 }, testExact)
    ).not.toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.5 }, testExact)
    ).not.toThrow();
    expect(() =>
      testDimensions(
        dimensions,
        { width: 3000, height: 2000, aspectRatio: 1.5 },
        testExact
      )
    ).not.toThrow();

    expect(() =>
      testDimensions(dimensions, { width: 3001 }, testExact)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { height: 2001 }, testExact)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { aspectRatio: 1.6 }, testExact)
    ).toThrow();
    expect(() =>
      testDimensions(dimensions, { width: 4001, height: 3000 }, testExact)
    ).toThrow();

    expect(() => testValue(dimensions, 1999, testExact)).toThrow();
    expect(() => testValue(dimensions, 2000, testExact)).toThrow();
    expect(() => testValue(dimensions, 3000, testExact)).toThrow();
    expect(() => testValue(dimensions, 3001, testExact)).toThrow();
    expect(() =>
      testValue({ width: 1500, height: 1500, aspectRatio: 1 }, 1500, testExact)
    ).not.toThrow();
  });
});

suite("test rules with 3000x2000 image", () => {
  const filename = path.join(
    __dirname,
    "../../__fixtures__/dimensions-3000x2000.jpg"
  );
  test("should return true for valid dimensions", async () => {
    const config: RuleConfig = {
      max: 3000,
    };
    const rule = dimensions(config);
    expect(() => rule(filename)).not.toThrow();
  });
  test("should return false for invalid dimensions", async () => {
    const config: RuleConfig = {
      min: {
        width: 4000,
      },
    };
    const rule = dimensions(config);
    expect(() => rule(filename)).toThrow();
  });
});

suite("test rules with 4000x3000 image", () => {
  const filename = path.join(
    __dirname,
    "../../__fixtures__/dimensions-4000x3000.jpg"
  );
  test("should throw error for invalid dimensions", async () => {
    const config: RuleConfig = {
      max: {
        width: 3000,
      },
    };
    const rule = dimensions(config);
    expect(() => rule(filename)).toThrow();
  });
});
