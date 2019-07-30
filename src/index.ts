import { getControllersAndModels } from "./ProjectHelper";
import { generateEverything } from "./CodegenHelper";

const infos = getControllersAndModels("test/samples/*.ts");

generateEverything(infos);