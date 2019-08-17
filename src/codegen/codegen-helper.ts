import Handlebars from 'handlebars';
import { writeFileSync, mkdirSync } from "fs";
import rimraf from 'rimraf';
import { ModelSource, createModelSource, Import } from "./model-source";
import { CodegenSettings } from "..";
import { Controller, getControllersAndModels } from "../analyzer/project-helper";
import { Model } from '../analyzer/model';
import path from 'path';

export function generateAllFiles(codegenSettings: CodegenSettings) {
    rimraf.sync(codegenSettings.modelsDir);
    mkdirSync(codegenSettings.modelsDir, { recursive: true });

    const controllersAndModels = getControllersAndModels(codegenSettings.tsConfigFilePath);
    generateModelFiles(codegenSettings, controllersAndModels.models);
    generateRouteInterceptorFile(codegenSettings, controllersAndModels.controllers);
}

function generateModelFiles(codegenSettings: CodegenSettings, models: Model[]) {
    const template = Handlebars.compile(codegenSettings.modelTemplate);
    const getModelPath = (model: Model) => path.posix.join(codegenSettings.modelsDir, model.name + '.ts');
    const generateModelFile = (modelSource: ModelSource) => writeFileSync(getModelPath(modelSource.model), template(modelSource));
    models.filter(m => m.isCustom).map(createModelSource).forEach(generateModelFile);
}

export function relativeImportedModuleName(importToModuleName: string, importFromModuleName: string) {
    const pp = path.posix;
    const relativeDir = pp.relative(pp.dirname(importToModuleName), pp.dirname(importFromModuleName));
    return './' + pp.join(relativeDir, pp.basename(importFromModuleName));
}

function createImport(currentPath: string, modelsDir: string, model: Model): Import {
    return {
        moduleName: relativeImportedModuleName(currentPath, path.posix.join(modelsDir, model.name)),
        name: model.name
    };
}

function generateRouteInterceptorFile(codegenSettings: CodegenSettings, routeControllers: Controller[]) {
    const template = Handlebars.compile(codegenSettings.routeInterceptorTemplate);
    const content = template({
        controllers: routeControllers,
        imports: routeControllers.map(x => x.methods.map(m => m.returnModel)).flat().map(p => createImport(codegenSettings.routeInterceptorPath, codegenSettings.modelsDir, p))
    });

    writeFileSync(codegenSettings.routeInterceptorPath, content);
}


