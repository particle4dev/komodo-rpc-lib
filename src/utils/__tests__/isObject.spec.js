import isObject from "../isObject";

it("src/utils/isObject", () => {
  expect(isObject("")).toEqual(false);
  expect(isObject({})).toEqual(true);
  expect(isObject(0)).toEqual(false);
  expect(isObject(null)).toEqual(false);
  expect(isObject([])).toEqual(true);
  expect(isObject(() => {})).toEqual(true);
});
