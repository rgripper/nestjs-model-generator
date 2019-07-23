import { TypeInfo, ControllerPaths, getAllInfos, PartialTypeInfo } from "./ModelHelper";
import Handlebars from 'handlebars';
import { writeFileSync, mkdirSync, readFileSync } from "fs";

const modelsDir = 'generated/models';

type Import = {
    path: string;
    name: string;
}

async function generateModelFile(typeInfo: TypeInfo) {
    // model with references to other models
    const template = Handlebars.compile(readFileSync('src/Model.hbs').toString());
    const content = template({
        ...typeInfo,
        imports: createImports(typeInfo)
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync(modelsDir + '/' + typeInfo.name + '.ts', content);
}

function createModelModuleImport(typeInfo: PartialTypeInfo): Import {
    return {
        path: `./${typeInfo.name}`,
        name: typeInfo.name
    };
}

export function isModelType(typeInfo: TypeInfo) {
    return typeInfo.type.isObject() && !typeInfo.type.isArray();
}

export function generateEverything(crispName: ReturnType<typeof getAllInfos>) {
    crispName.modelTypeInfos.filter(isModelType).forEach(generateModelFile);
    //generateModelsIndexFile(crispName.modelTypeInfos);
    generateControllerPathsFile(crispName.controllerPaths);
}

export function createImports(typeInfo: TypeInfo): Import[] {
    const typeInfos: Import[] = [];
    if (typeInfo.arrayElementCustomTypeInfo) {
        typeInfos.push(createModelModuleImport(typeInfo.arrayElementCustomTypeInfo)) 
    }

    const unwrapIfArray = (typeInfo: TypeInfo): TypeInfo => typeInfo.arrayElementCustomTypeInfo ? unwrapIfArray(typeInfo.arrayElementCustomTypeInfo) : typeInfo;
    const propTypeInfos = typeInfo.properties.map(x => x.typeInfo);
    if (typeInfo.arrayElementCustomTypeInfo) {
        propTypeInfos.push(typeInfo.arrayElementCustomTypeInfo);
    }

    const imports = propTypeInfos.map(unwrapIfArray).filter(isModelType).map(createModelModuleImport); // arrays!
    console.log(typeInfo.name, propTypeInfos.map(unwrapIfArray).map(x => x.name), propTypeInfos.map(unwrapIfArray).map(x => x.arrayElementCustomTypeInfo !== undefined));

    return imports;
}

// function generateModelsIndexFile(typeInfos: TypeInfo[]) {
//     // generates export
//     await writeFileSync('denerated/models/' + typeInfos.name + '.ts', content);
// }

function generateControllerPathsFile(controllerPaths: ControllerPaths[]) {
    
}