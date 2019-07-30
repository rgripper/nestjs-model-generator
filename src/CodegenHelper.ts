import { Controller, getControllersAndModels } from "./ProjectHelper";
import Handlebars from 'handlebars';
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { Model } from "./Model";

const generatedDirectory = 'test/generated';

const modelsDir = generatedDirectory + '/models';
const routeInterceptorPath = generatedDirectory + '/RouteInterceptor.ts';

type Import = {
    path: string;
    name: string;
}

export function generateEverything(crispName: ReturnType<typeof getControllersAndModels>) {
    crispName.models.filter(isClassModel).forEach(generateModelFile);
    generateControllerPathsFile(crispName.controllers);
}


async function generateModelFile(model: Model) {
    // model with references to other models
    const template = Handlebars.compile(readFileSync('src/Model.hbs').toString());
    const content = template({
        ...model,
        properties: model.properties.map(p => ({ ...p, isClassModel: isClassModel(p.model)})),
        imports: createImports('.', model)
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync(modelsDir + '/' + model.name + '.ts', content);
}

function generateControllerPathsFile(routeControllers: Controller[]) {
    const template = Handlebars.compile(readFileSync('src/RouteInterceptor.hbs').toString());
    const content = template({
        controllers: routeControllers,
        imports: routeControllers.map(x => x.methods.map(m => m.returnModel)).flat().map(p => createModelModuleImport('./models', p))
    });

    mkdirSync(modelsDir, { recursive: true });
    writeFileSync(routeInterceptorPath, content);
}

function createModelModuleImport(basePath: string, model: Model): Import {
    return {
        path: basePath + `/${model.name}`,
        name: model.name
    };
}

function isClassModel(model: Model) {
    return model.type.isEnum() || (model.type.isObject() && !model.type.isArray());
}

function createImports(basePath: string, model: Model): Import[] {
    const models: Import[] = [];
    if (model.arrayElementModel) {
        models.push(createModelModuleImport(basePath, model.arrayElementModel)) 
    }

    const unwrapIfArray = (model: Model): Model => model.arrayElementModel ? unwrapIfArray(model.arrayElementModel) : model;
    const propModels = model.properties.map(x => x.model);
    if (model.arrayElementModel) {
        propModels.push(model.arrayElementModel);
    }

    const imports = propModels.map(unwrapIfArray).filter(isClassModel).map(p => createModelModuleImport(basePath, p)); // arrays!
    console.log(model.name, propModels.map(unwrapIfArray).map(x => x.name), propModels.map(unwrapIfArray).map(x => x.arrayElementModel !== undefined));

    return imports;
}

