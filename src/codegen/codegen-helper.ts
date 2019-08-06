import Handlebars from 'handlebars';
import { writeFileSync, mkdirSync } from "fs";
import rimraf from 'rimraf';
import { ModelSource, createModelSource, createImport } from "./model-source";
import { CodegenSettings } from "..";
import { Controller, getControllersAndModels } from "../analyzer/project-helper";
import { Model } from '../analyzer/model';
import path from 'path';

export function generateAllFiles(codegenSettings: CodegenSettings) {
    rimraf.sync(codegenSettings.modelsDir);
    mkdirSync(codegenSettings.modelsDir, { recursive: true });

    const controllersAndModels = getControllersAndModels(codegenSettings.inputFilesGlob);
    generateModelFiles(codegenSettings, controllersAndModels.models);
    generateRouteInterceptorFile(codegenSettings, controllersAndModels.controllers);
}

function generateModelFiles(codegenSettings: CodegenSettings, models: Model[]) {
    const template = Handlebars.compile(codegenSettings.modelTemplate);
    const getModelPath = (model: Model) => path.join(codegenSettings.modelsDir, model.name + '.ts');
    const generateModelFile = (modelSource: ModelSource) => writeFileSync(getModelPath(modelSource.model), template(modelSource));
    models.filter(m => m.isCustom).map(createModelSource).forEach(generateModelFile);
}

function generateRouteInterceptorFile(codegenSettings: CodegenSettings, routeControllers: Controller[]) {
    const template = Handlebars.compile(codegenSettings.routeInterceptorTemplate);
    const content = template({
        controllers: routeControllers,
        imports: routeControllers.map(x => x.methods.map(m => m.returnModel)).flat().map(p => createImport(codegenSettings.routeInterceptorPath, codegenSettings.modelsDir, p))
    });

    writeFileSync(codegenSettings.routeInterceptorPath, content);
}


