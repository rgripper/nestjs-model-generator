import { Project, SourceFile, ClassDeclaration, MethodDeclaration } from 'ts-morph';
import { createCache } from './TypeInfoCache';
import { TypeInfo, GetTypeInfoFromNode } from './TypeInfo';

const typeInfoCache = createCache();

type MethodInfo = { 
    name: string
    returnTypeInfo: TypeInfo 
}

export type ControllerInfo = {
    name: string;
    methods: MethodInfo[];
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
    

    return {
        routeControllers: sourceFiles.map(sf => getControllerInfos(sf, typeInfoCache.getOrAdd)).flat(),
        typeInfos: typeInfoCache.getAllCached()
    };
}

function getControllerInfos(sourceFile: SourceFile, getTypeInfo: GetTypeInfoFromNode): ControllerInfo[] {
    return sourceFile.getClasses().filter(isControllerClass).map(x => createControllerInfo(x, getTypeInfo));
}

function createControllerInfo(classDeclaration: ClassDeclaration, getTypeInfo: GetTypeInfoFromNode): ControllerInfo {
    const methods = classDeclaration.getMethods();
    const pathMethods = methods.map(x => createControllerPathMethod(x, getTypeInfo));
    return {
        name: classDeclaration.getNameOrThrow(),
        methods: pathMethods
    }
}

function createControllerPathMethod(methodDeclaration: MethodDeclaration, getTypeInfo: GetTypeInfoFromNode): MethodInfo {
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