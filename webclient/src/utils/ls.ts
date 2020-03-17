import { get as _get, merge } from "lodash";

const update = (key: string, value = {}) => {
  const current = JSON.parse((localStorage.getItem(key) as any) || "{}");
  const newObj = merge(current, value);
  localStorage.setItem(key, JSON.stringify(newObj));
};

const get = (key: string, chain: string, fallback?: any) => {
  return _get(JSON.parse(localStorage.getItem(key) || "{}"), chain, fallback || "");
};

export const ls = {
  update,
  get,
};

export default ls;
