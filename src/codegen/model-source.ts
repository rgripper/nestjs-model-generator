import { Model } from "../analyzer/model";
import path from 'path';

export type ModelSource = {
    model: Model;
    imports: Import[];
}

export type Import = {
    moduleName: string;
    name: string;
}

export function createModelSource(model: Model): ModelSource {
    return {
        model, 
        imports: getImportedModels(model).map<Import>(m => ({
            moduleName: './' + model.name,
            name: model.name
        }))
    }
}

function isClass(model: Model) {
    return model.type.isEnum() || (model.type.isObject() && !model.type.isArray());
}

function getImportedModels(model: Model): Model[] {
    return model.properties.map(x => x.model).map(unwrapIfArray).filter(isClass);
}

function unwrapIfArray(model: Model): Model {
    return model.arrayElementModel ? unwrapIfArray(model.arrayElementModel) : model;
}