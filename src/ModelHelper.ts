import { Type, ts, Symbol, Node, Project, TypeFormatFlags, SourceFile, ClassDeclaration, MethodDeclaration } from 'ts-morph';
import crypto from 'crypto';
const hash = crypto.createHash('sha256');

export type PartialTypeInfo = {
    type: Type<ts.Type>;
    name: string;
    text: string;
}

type ReferencesInType = {
    arrayElementCustomTypeInfo: TypeInfo | undefined;
    properties: PropertyInfo[];
}

export type TypeInfo = PartialTypeInfo & ReferencesInType;

type PropertyInfo = {
    name: string;
    typeInfo: TypeInfo;
}

type ControllerPathMethod = { 
    name: string
    returnTypeInfo: TypeInfo 
}

export type ControllerPaths = {
    className: string;
    methods: ControllerPathMethod[];
}

export function getAllInfos(glob: string) {
    const project = new Project({
        // Optionally specify compiler options, tsconfig.json, virtual file system, and more here.
        // If you initialize with a tsconfig.json, then it will automatically populate the project
        // with the associated source files.
        // Read more: https://dsherret.github.io/ts-morph/setup/
    });
    
    project.addExistingSourceFiles(glob);
    
    const sourceFiles = project.getSourceFiles();
    
    const createCache = (getPartialTypeInfo: GetPartialTypeInfo, resolveReferencesInType: ResolveReferencesInType) => {
        const typeInfoCache = new Map<string, TypeInfo>();

        const getOrAdd: GetTypeInfo = node => {
            const cacheKey = getNodeCacheKey(node);
            let typeInfo = typeInfoCache.get(cacheKey);
            if (typeInfo === undefined) {
                typeInfo = getPartialTypeInfo(node) as TypeInfo;
                typeInfoCache.set(cacheKey, typeInfo);
                const resolvedReferences = resolveReferencesInType(typeInfo.type, getOrAdd);
                Object.assign(typeInfo, resolvedReferences)
            }
            return typeInfo;
        }

        return {
            getAllCached: () => Array.from(typeInfoCache.values()),
            getOrAdd
        }
    }

    const typeInfoCache = createCache(getPartialTypeInfo, resolveReferencesInType);
    return {
        controllerPaths: sourceFiles.map(sf => getControllerInfos(sf, typeInfoCache.getOrAdd)).flat(),
        modelTypeInfos: typeInfoCache.getAllCached()
    };
}

type GetTypeInfo = (node: Node) => TypeInfo

function getControllerInfos(sourceFile: SourceFile, getTypeInfo: GetTypeInfo): ControllerPaths[] {
    return sourceFile.getClasses().filter(isControllerClass).map(x => createControllerInfo(x, getTypeInfo));
}

function createControllerInfo(classDeclaration: ClassDeclaration, getTypeInfo: GetTypeInfo): ControllerPaths {
    const methods = classDeclaration.getMethods();
    const pathMethods = methods.map(x => createControllerPathMethod(x, getTypeInfo));
    return {
        className: classDeclaration.getNameOrThrow(),
        methods: pathMethods
    }
}

function createControllerPathMethod(methodDeclaration: MethodDeclaration, getTypeInfo: GetTypeInfo): ControllerPathMethod {
    const returnType = methodDeclaration.getReturnTypeNodeOrThrow();

    return {
        name: methodDeclaration.getName(),
        returnTypeInfo: getTypeInfo(returnType)
    }
}

function isControllerClass(declaration: ClassDeclaration): boolean {
    const name = declaration.getName();
    return name !== undefined && name.endsWith('Controller');
}

function getNodeCacheKey(typeNode: Node) {
    return typeNode.getSourceFile().getFilePath() + ':' + typeNode.getType().getText(undefined, ts.TypeFormatFlags.None);
}

type GetPartialTypeInfo = typeof getPartialTypeInfo;

function getPartialTypeInfo(typeNode: Node): PartialTypeInfo {
    // not-covered cases: enum, union, generic
    const type = typeNode.getType();
    const text = type.getText(undefined, TypeFormatFlags.None);
    return {
        type,
        text,
        name: (type.isAnonymous() && !type.compilerType.aliasSymbol) ? generateAnonymousTypeName(type) : text
    }
}

type ResolveReferencesInType = typeof resolveReferencesInType;

function resolveReferencesInType(type: Type<ts.Type>, getTypeInfo: GetTypeInfo): ReferencesInType {
    // not-yet-covered cases: Date, enum, union, generics
    const elementType = type.isArray() ? type.getArrayElementTypeOrThrow() : undefined;
    const isBuiltIn = elementType && !elementType.getSymbol() && !elementType.getAliasSymbol();
    if (isBuiltIn) {
        console.log();
    }
    const arrayElementCustomTypeInfo = elementType 
        ? (isBuiltIn // TODO
            ? { type: elementType, name: type.getText(undefined, TypeFormatFlags.None), text: type.getText(undefined, TypeFormatFlags.None), properties: [], arrayElementCustomTypeInfo: undefined }
            : getTypeInfo(elementType.getSymbolOrThrow().getDeclarations()[0]))
        : undefined;

    return {
        properties: (type.isObject() && !type.isArray()) ? type.getProperties().map(p => getPropertyInfo(p, getTypeInfo)) : [],
        arrayElementCustomTypeInfo
    }
}

function generateAnonymousTypeName(type: Type<ts.Type>) {
    return 'Anonynous_' + hash.update(type.getText(undefined, TypeFormatFlags.None)).digest('hex');
}

function getPropertyInfo(property: Symbol, getTypeInfo: GetTypeInfo): PropertyInfo {
    return {
        name: property.getName(),
        typeInfo: getTypeInfo(property.getValueDeclarationOrThrow())
    }
}