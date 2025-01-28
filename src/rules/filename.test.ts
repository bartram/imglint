import { filename } from "./filename.js";

const rule = filename({ match: /^^\d+\s.+\.jpg$/ });

it("should pass on valid filenames", () => {
  expect(() => rule.test("1234 test.jpg")).not.toThrow();
  expect(() => rule.test("01 my test image name.jpg")).not.toThrow();
});

it("should fail on invalid filenames", () => {
  expect(() => rule.test("test.jpg")).toThrow();
  expect(() => rule.test("1234test.jpg")).toThrow();
  expect(() => rule.test("1234 test.png")).toThrow();
});
