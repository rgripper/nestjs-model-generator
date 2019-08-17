import { ts, Node, Type, Symbol as SymbolWrapper } from 'ts-morph';
import { Model, GetModelFromNode, createModelFromNode, createProperty, GetDecoratorsForProperty, createArrayElementModel } from './model';

export function createModelGraph (getDecoratorsForProperty: GetDecoratorsForProperty) {
    return createModelGraphWithParams({ 
        getKey, 
        createValue: (node: Node<ts.Node>, getModelFromNode: GetModelFromNode) =>
            createModelFromNode(
                node, 
                (propertySymbol: SymbolWrapper) => createProperty(propertySymbol, getModelFromNode, getDecoratorsForProperty),
                (type: Type) => createArrayElementModel(type, getModelFromNode)
            )
    });
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
            // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
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
