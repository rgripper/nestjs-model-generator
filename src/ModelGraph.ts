import { ts, Node } from 'ts-morph';
import { Model, GetModelFromNode, createModelFromNode } from './Model';

export function createModelGraph () {
    return createModelGraphWithParams({ getKey, createValue: createModelFromNode });
}

type ModelGraphParams = { 
    getKey: (node: Node) => string;
    createValue: (node: Node, getModelFromNode: GetModelFromNode) => Model; 
};

function createModelGraphWithParams ({ getKey, createValue }: ModelGraphParams) {
    const cache = new Map<string, Model>();

    const getOrAdd = (node: Node) => {
        const key = getKey(node);
        let model = cache.get(key);
        if (model === undefined) {
            model = {} as Model;
            cache.set(key, model);
            const fullModel = createValue(node, getOrAdd);
            Object.assign(model, fullModel);
        }
        return model;
    }

    return {
        getAll: () => Array.from(cache.values()),
        getOrAdd
    }
}

function getKey(typeNode: Node) {
    return typeNode.getSourceFile().getFilePath() + ':' + typeNode.getType().getText(undefined, ts.TypeFormatFlags.None);
}
