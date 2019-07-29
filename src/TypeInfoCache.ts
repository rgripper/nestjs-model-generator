import { ts, Node } from 'ts-morph';
import { TypeInfo, GetTypeInfoFromNode, createTypeInfoFromNode } from './TypeInfo';

export function createCache () {
    return createCacheWithParams({ getKey, createTypeInfoFromNode });
}

type CacheParams = { 
    getKey: (typeNode: Node) => string;
    createTypeInfoFromNode: (typeNode: Node, getTypeInfoFromNode: GetTypeInfoFromNode) => TypeInfo; 
};

function createCacheWithParams ({ getKey, createTypeInfoFromNode }: CacheParams) {
    const cache = new Map<string, TypeInfo>();

    const getOrAdd = (node: Node) => {
        const key = getKey(node);
        let typeInfo = cache.get(key);
        if (typeInfo === undefined) {
            typeInfo = {} as TypeInfo;
            cache.set(key, typeInfo);
            const fullTypeInfo = createTypeInfoFromNode(node, getOrAdd);
            Object.assign(typeInfo, fullTypeInfo);
        }
        return typeInfo;
    }

    return {
        getAllCached: () => Array.from(cache.values()),
        getOrAdd
    }
}

function getKey(typeNode: Node) {
    return typeNode.getSourceFile().getFilePath() + ':' + typeNode.getType().getText(undefined, ts.TypeFormatFlags.None);
}
