import {
  chainDependencies,
  create,
  multiplyDependencies,
  subtractDependencies,
} from "mathjs";

export default create(
  { multiplyDependencies, subtractDependencies, chainDependencies },
  {},
);
