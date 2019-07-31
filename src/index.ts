import { getControllersAndModels } from "./analyzer/project-helper";
import { generateEverything } from "./codegen/codegen-helper";

const infos = getControllersAndModels("test/samples/*.ts");

generateEverything(infos);