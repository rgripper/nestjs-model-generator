import { Type, ts, Symbol, Node, TypeFormatFlags } from 'ts-morph';
import { isBuiltInType, getTypeName } from './TypeHelper';

export type TypeInfo = TypeHead & ReferencesInType;

export type TypeHead = {
    type: Type;
    name: string;
}

export type ReferencesInType = {
    arrayElementTypeInfo: TypeInfo | undefined;
    properties: PropertyInfo[];
}

export type PropertyInfo = {
    name: string;
    typeInfo: TypeInfo;
}

export type GetTypeInfoFromNode = (node: Node) => TypeInfo;

export function getTypeHead(typeNode: Node): TypeHead {
    // not-covered cases: enum, union, generic
    const type = typeNode.getType();
    return {
        type,
        name: getTypeName(type)
    }
}

export function resolveReferencesInType(type: Type, getTypeInfoFromNode: GetTypeInfoFromNode): ReferencesInType {
    // not-yet-covered cases: Date, enum, union, generics
    return {
        properties: isBuiltInType(type) ? [] : type.getProperties().map(p => getPropertyInfo(p, getTypeInfoFromNode)),
        arrayElementTypeInfo: type.isArray() ? createArrayElementTypeInfo(type, getTypeInfoFromNode) : undefined
    };
}

function getPropertyInfo(property: Symbol, getTypeInfoFromNode: GetTypeInfoFromNode): PropertyInfo {
    return {
        name: property.getName(),
        typeInfo: getTypeInfoFromNode(property.getValueDeclarationOrThrow())
    }
}

function createArrayElementTypeInfo (type: Type, getTypeInfoFromNode: GetTypeInfoFromNode): TypeInfo | undefined {
    const elementType = type.getArrayElementTypeOrThrow();

    return isBuiltInType(elementType)
            ? createBuiltInTypeInfo(elementType)
            : getTypeInfoFromNode(elementType.getSymbolOrThrow().getDeclarations()[0])
}

function createBuiltInTypeInfo(type: Type): TypeInfo {
    return { 
        type, 
        name: type.getText(undefined, TypeFormatFlags.None), 
        properties: [], 
        arrayElementTypeInfo: undefined 
    }
}

