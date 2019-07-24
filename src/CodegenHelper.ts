import { TypeInfo, RouteController, getAllInfos, PartialTypeInfo } from "./ModelHelper";
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
        imports: createImports('.', typeInfo)
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync(modelsDir + '/' + typeInfo.name + '.ts', content);
}

function generateControllerPathsFile(routeControllers: RouteController[]) {
    const template = Handlebars.compile(readFileSync('src/ControllerPaths.hbs').toString());
    const content = template({
        controllers: routeControllers,
        imports: routeControllers.map(x => x.methods.map(m => m.returnTypeInfo)).flat().map(p => createModelModuleImport('./models', p))
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync('generated/paths.ts', content);
}

function createModelModuleImport(basePath: string, typeInfo: PartialTypeInfo): Import {
    return {
        path: basePath + `/${typeInfo.name}`,
        name: typeInfo.name
    };
}

export function isModelType(typeInfo: TypeInfo) {
    console.log(typeInfo.name, 'typeInfo.type.isObject()', typeInfo.type.isObject())
    return typeInfo.type.isEnum() || (typeInfo.type.isObject() && !typeInfo.type.isArray());
}

export function generateEverything(crispName: ReturnType<typeof getAllInfos>) {
    crispName.modelTypeInfos.filter(isModelType).forEach(generateModelFile);
    generateControllerPathsFile(crispName.controllerPaths);
}

export function createImports(basePath: string, typeInfo: TypeInfo): Import[] {
    const typeInfos: Import[] = [];
    if (typeInfo.arrayElementCustomTypeInfo) {
        typeInfos.push(createModelModuleImport(basePath, typeInfo.arrayElementCustomTypeInfo)) 
    }

    const unwrapIfArray = (typeInfo: TypeInfo): TypeInfo => typeInfo.arrayElementCustomTypeInfo ? unwrapIfArray(typeInfo.arrayElementCustomTypeInfo) : typeInfo;
    const propTypeInfos = typeInfo.properties.map(x => x.typeInfo);
    if (typeInfo.arrayElementCustomTypeInfo) {
        propTypeInfos.push(typeInfo.arrayElementCustomTypeInfo);
    }

    const imports = propTypeInfos.map(unwrapIfArray).filter(isModelType).map(p => createModelModuleImport(basePath, p)); // arrays!
    console.log(typeInfo.name, propTypeInfos.map(unwrapIfArray).map(x => x.name), propTypeInfos.map(unwrapIfArray).map(x => x.arrayElementCustomTypeInfo !== undefined));

    return imports;
}

