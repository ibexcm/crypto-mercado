import { createContext } from "react";
import { Dependencies } from "../../libraries/di";

export const sharedDependencies = new Dependencies();
const DependencyContext = createContext(sharedDependencies);
export default DependencyContext;
