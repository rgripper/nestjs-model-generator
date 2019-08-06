import { Model } from "../analyzer/model";
import path from 'path';

export type ModelSource = {
    model: Model;
    imports: Import[];
}

type Import = {
    modulePath: string;
    name: string;
}

export function createModelSource(model: Model): ModelSource {
    return {
        model, 
        imports: getImportedModels(model).map<Import>(m => ({
            modulePath: path.join('.', model.name),
            name: model.name
        }))
    }
}

export function createImport(currentPath: string, modelDir: string, model: Model): Import {
    return {
        modulePath: path.join(path.relative(modelDir, currentPath), model.name),
        name: model.name
    };
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