export function ObjSetAll(obj, val) {
  return Object.keys(obj).forEach(k => obj[k] = val);
}
