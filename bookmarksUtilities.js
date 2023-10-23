export function valueMatch(value, searchValue) {
  try {
    let exp = "^" + searchValue.toLowerCase().replace(/\*/g, ".*") + "$";
    return new RegExp(exp).test(value.toString().toLowerCase());
  } catch (error) {
    console.log(error);
    return false;
  }
}
export function compareNum(x, y) {
  if (x === y) return 0;
  else if (x < y) return -1;
  return 1;
}
export function innerCompare(x, y) {
  if (typeof x === "string") return x.localeCompare(y);
  else return this.compareNum(x, y);
}
