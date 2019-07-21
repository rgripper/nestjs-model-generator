import { TypeInfo, ControllerPaths, getAllInfos } from "./ModelHelper";

export function generateEverything(crispName: ReturnType<typeof getAllInfos>) {
    crispName.modelTypeInfos.forEach(generateModelFile);
    generateModelsIndexFile(crispName.modelTypeInfos);
    generateControllerPathsFile(crispName.controllerPaths);
}

function generateModelFile(typeInfo: TypeInfo) {
    // model with references to other models
}

function generateModelsIndexFile(typeInfos: TypeInfo[]) {
    // generates export
}

function generateControllerPathsFile(controllerPaths: ControllerPaths[]) {
    
}