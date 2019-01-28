// @flow
// @docs
// - https://stackoverflow.com/a/22482737

export default function isObject(value: Object) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}
