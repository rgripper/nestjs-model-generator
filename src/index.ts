import { getAllInfos } from "./ModelHelper";
import { generateEverything } from "./CodegenHelper";

const infos = getAllInfos("test/samples/*.ts");

generateEverything(infos);