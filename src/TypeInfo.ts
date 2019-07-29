import { Type, Symbol, Node, TypeFormatFlags } from 'ts-morph';
import { isBuiltInType, getTypeName } from './TypeHelper';

export type TypeInfo = {
    type: Type;
    name: string;
    arrayElementTypeInfo: TypeInfo | undefined;
    properties: PropertyInfo[];
}

export type PropertyInfo = {
    name: string;
    typeInfo: TypeInfo;
}

export type GetTypeInfoFromNode = (node: Node) => TypeInfo;
export type CreateTypeInfoFromNode = (node: Node, getTypeInfoFromNode: GetTypeInfoFromNode) => TypeInfo;

export function createTypeInfoFromNode(typeNode: Node, getTypeInfoFromNode: GetTypeInfoFromNode): TypeInfo {
    // not-covered cases: enum, union, generic
    const type = typeNode.getType();
    return {
        type,
        name: getTypeName(type),
        properties: isBuiltInType(type) ? [] : type.getProperties().map(p => getPropertyInfo(p, getTypeInfoFromNode)),
        arrayElementTypeInfo: type.isArray() ? createArrayElementTypeInfo(type, getTypeInfoFromNode) : undefined
    }
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

