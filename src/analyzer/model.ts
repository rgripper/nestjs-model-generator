import { Type, Symbol as SymbolWrapper, Node, TypeFormatFlags, TypeGuards, TypeNode, PropertySignature } from 'ts-morph';
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
    isOptional: boolean;
    isNullable: boolean;
    decorators: Decorator[];
    model: Model;
}

type Param = { name: string; value: unknown }

export type Decorator = {
    params: Param[];
}

export type GetDecoratorsForProperty = (property: Omit<Property, 'decorators'>) => Decorator[];
export type GetModelFromNode = (node: TypeNode) => Model;
export type CreateProperty = (propertySymbol: SymbolWrapper, getModelFromNode: GetModelFromNode) => Property;

export function createModelFromNode(
    typeNode: Node, 
    createProperty: (propertySymbol: SymbolWrapper) => Property,
    createArrayElementModel: (type: Type) => Model
): Model {
    // not-covered cases: enum, union, generic
    const type = typeNode.getType();
    return {
        type,
        name: getTypeName(type),
        isCustom: !isBuiltInType(type),
        properties: isBuiltInType(type) ? [] : type.getProperties().map(createProperty),
        arrayElementModel: type.isArray() ? createArrayElementModel(type) : undefined
    }
}

export function createProperty(propertySymbol: SymbolWrapper, getModelFromNode: GetModelFromNode, getDecoratorsForProperty: GetDecoratorsForProperty): Property {
    const node = propertySymbol.getValueDeclarationOrThrow();
    if (!TypeGuards.isPropertySignature(node)) {
        throw new Error(`Expected a PropertySignature but was ${node.getKindName()}`);
    }

    const model = getModelFromNode(node.getTypeNodeOrThrow());

    const propertyWithoutDecorators = {
        name: propertySymbol.getName(),
        model,
        isOptional: isOptionalPropertySignature(node), // have to be a property signature node
        isNullable: isNullableType(model.type),
    }

    return {
        ...propertyWithoutDecorators,
        decorators: getDecoratorsForProperty(propertyWithoutDecorators)
    }
}

// TODO: move to a helper file
export function isOptionalPropertySignature(node: PropertySignature): boolean {
    // doesn't go into unions of unions
    return node.hasQuestionToken() || isUndefinedOrHasUndefinedUnionType(node.getTypeNodeOrThrow().getType());
}

// TODO: move to a helper file
function isUndefinedOrHasUndefinedUnionType(type: Type): boolean {
    return type.isUndefined() || type.isUnion() && type.getUnionTypes().some(isUndefinedOrHasUndefinedUnionType);
}

// TODO: move to a helper file
function isNullableType(type: Type): boolean {
    return type.isNull() || type.isUnion() && type.getUnionTypes().some(isNullableType);
}

export function createArrayElementModel (type: Type, getModelFromNode: GetModelFromNode): Model {
    const elementType = type.getArrayElementTypeOrThrow();

    return isBuiltInType(elementType)
        ? createBuiltInModel(elementType)
        : getModelFromNode(getTypeNodeFromType(elementType))
}

function getTypeNodeFromType(type: Type) {
    const declaration = type.getSymbolOrThrow().getDeclarations()[0];
    if (!TypeGuards.isTypeNode(declaration)) {
        throw new Error(`Expected a TypeNode but was ${declaration.getKindName()}`);
    }

    return declaration;
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

