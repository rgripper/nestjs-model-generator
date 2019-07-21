import { getAllInfos } from "./ModelHelper";
import { generateEverything } from "./CodegenHelper";

const infos = getAllInfos("src/test*.ts");

generateEverything(infos);