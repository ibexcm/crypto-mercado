import { get as _get, merge } from "lodash";

const update = (key: string, value: string | {} = {}) => {
  if (typeof value === "object") {
    const current = JSON.parse((sessionStorage.getItem(key) as any) || "{}");
    const newObj = merge(current, value);
    sessionStorage.setItem(key, JSON.stringify(newObj));
  } else {
    sessionStorage.setItem(key, value as string);
  }
};

const get = (key: string, chain: string, fallback?: any) => {
  return _get(JSON.parse(sessionStorage.getItem(key) || "{}"), chain, fallback || "");
};

export const ss = {
  update,
  get,
};

export default ss;
