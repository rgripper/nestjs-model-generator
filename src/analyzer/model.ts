import { Type, Symbol as SymbolWrapper, Node, TypeFormatFlags } from 'ts-morph';
import { isBuiltInType, getTypeName } from './type-helper';

export type Model = {
    type: Type;
    name: string;
    /**
     * Is customizable and generated as a class.
     */
    isCustom: boolean;
    arrayElementModel: Model | undefined;
    properties: Property[];
}

export type Property = {
    name: string;
    model: Model;
}

export type GetModelFromNode = (node: Node) => Model;
export type CreateModelFromNode = (node: Node, getModelFromNode: GetModelFromNode) => Model;

export function createModelFromNode(typeNode: Node, getModelFromNode: GetModelFromNode): Model {
    // not-covered cases: enum, union, generic
    const type = typeNode.getType();
    return {
        type,
        name: getTypeName(type),
        isCustom: !isBuiltInType(type),
        properties: isBuiltInType(type) ? [] : type.getProperties().map(p => createProperty(p, getModelFromNode)),
        arrayElementModel: type.isArray() ? createArrayElementModel(type, getModelFromNode) : undefined
    }
}

function createProperty(propertySymbol: SymbolWrapper, getModelFromNode: GetModelFromNode): Property {
    return {
        name: propertySymbol.getName(),
        model: getModelFromNode(propertySymbol.getValueDeclarationOrThrow())
    }
}

function createArrayElementModel (type: Type, getModelFromNode: GetModelFromNode): Model | undefined {
    const elementType = type.getArrayElementTypeOrThrow();

    return isBuiltInType(elementType)
        ? createBuiltInModel(elementType)
        : getModelFromNode(elementType.getSymbolOrThrow().getDeclarations()[0])
}

function createBuiltInModel(type: Type): Model {
    return { 
        type, 
        name: type.getText(undefined, TypeFormatFlags.None),
        isCustom: false,
        properties: [], 
        arrayElementModel: undefined 
    }
}

