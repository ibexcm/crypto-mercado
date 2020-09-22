import { Dependencies } from "@ibexcm/libraries/di";
import { createContext } from "react";

export const sharedDependencies = new Dependencies();
const DependencyContext = createContext(sharedDependencies);
export default DependencyContext;
