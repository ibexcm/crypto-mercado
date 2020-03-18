import { merge } from "lodash";

const update = (key: string, value: string | {} = {}) => {
  if (typeof value === "object") {
    const current = JSON.parse((localStorage.getItem(key) as any) || "{}");
    const newObj = merge(current, value);
    localStorage.setItem(key, JSON.stringify(newObj));
  } else {
    localStorage.setItem(key, value as string);
  }
};

const get = (key: string) => {
  return localStorage.getItem(key);
};

export const ls = {
  update,
  get,
};

export default ls;
