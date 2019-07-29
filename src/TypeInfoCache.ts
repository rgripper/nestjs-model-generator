import { ts, Node, Type } from 'ts-morph';
import { TypeInfo, GetTypeInfoFromNode, getTypeHead, resolveReferencesInType, TypeHead, ReferencesInType } from './TypeInfo';

export function createCache () {
    return createCacheWithParams({ getTypeHead, getKey, resolveReferencesInType });
}

type CacheParams = { 
    getTypeHead: (node: Node) => TypeHead; 
    getKey: (typeNode: Node) => string;
    resolveReferencesInType: (type: Type, getTypeInfo: GetTypeInfoFromNode) => ReferencesInType; 
};

function createCacheWithParams ({ getTypeHead, getKey, resolveReferencesInType }: CacheParams) {
    const cache = new Map<string, TypeInfo>();

    const getOrAdd = (node: Node) => {
        const key = getKey(node);
        let typeInfo = cache.get(key);
        if (typeInfo === undefined) {
            typeInfo = getTypeHead(node) as TypeInfo;
            cache.set(key, typeInfo);
            const resolvedReferences = resolveReferencesInType(typeInfo.type, getOrAdd);
            Object.assign(typeInfo, resolvedReferences);
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
