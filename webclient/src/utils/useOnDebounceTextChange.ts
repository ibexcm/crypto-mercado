import { debounce } from "lodash";
import React from "react";

export const useOnDebounceTextChange = <T>(query: (val: T) => any) => {
  return React.useRef(debounce(query, 500));
};

export default useOnDebounceTextChange;
