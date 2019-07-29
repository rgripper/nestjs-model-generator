import { ControllerInfo, getAllInfos } from "./ModelHelper";
import Handlebars from 'handlebars';
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { TypeInfo } from "./TypeInfo";

const generatedDirectory = 'test/generated';

const modelsDir = generatedDirectory + '/models';
const routeInterceptorPath = generatedDirectory + '/RouteInterceptor.ts';

type Import = {
    path: string;
    name: string;
}

export function generateEverything(crispName: ReturnType<typeof getAllInfos>) {
    crispName.typeInfos.filter(isModelType).forEach(generateModelFile);
    generateControllerPathsFile(crispName.routeControllers);
}


async function generateModelFile(typeInfo: TypeInfo) {
    // model with references to other models
    const template = Handlebars.compile(readFileSync('src/Model.hbs').toString());
    const content = template({
        ...typeInfo,
        properties: typeInfo.properties.map(p => ({ ...p, isModelType: isModelType(p.typeInfo)})),
        imports: createImports('.', typeInfo)
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync(modelsDir + '/' + typeInfo.name + '.ts', content);
}

function generateControllerPathsFile(routeControllers: ControllerInfo[]) {
    const template = Handlebars.compile(readFileSync('src/RouteInterceptor.hbs').toString());
    const content = template({
        controllers: routeControllers,
        imports: routeControllers.map(x => x.methods.map(m => m.returnTypeInfo)).flat().map(p => createModelModuleImport('./models', p))
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync(routeInterceptorPath, content);
}

function createModelModuleImport(basePath: string, typeInfo: TypeInfo): Import {
    return {
        path: basePath + `/${typeInfo.name}`,
        name: typeInfo.name
    };
}

function isModelType(typeInfo: TypeInfo) {
    return typeInfo.type.isEnum() || (typeInfo.type.isObject() && !typeInfo.type.isArray());
}

function createImports(basePath: string, typeInfo: TypeInfo): Import[] {
    const typeInfos: Import[] = [];
    if (typeInfo.arrayElementTypeInfo) {
        typeInfos.push(createModelModuleImport(basePath, typeInfo.arrayElementTypeInfo)) 
    }

    const unwrapIfArray = (typeInfo: TypeInfo): TypeInfo => typeInfo.arrayElementTypeInfo ? unwrapIfArray(typeInfo.arrayElementTypeInfo) : typeInfo;
    const propTypeInfos = typeInfo.properties.map(x => x.typeInfo);
    if (typeInfo.arrayElementTypeInfo) {
        propTypeInfos.push(typeInfo.arrayElementTypeInfo);
    }

    const imports = propTypeInfos.map(unwrapIfArray).filter(isModelType).map(p => createModelModuleImport(basePath, p)); // arrays!
    console.log(typeInfo.name, propTypeInfos.map(unwrapIfArray).map(x => x.name), propTypeInfos.map(unwrapIfArray).map(x => x.arrayElementTypeInfo !== undefined));

    return imports;
}

