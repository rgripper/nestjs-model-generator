import { Project, SourceFile, ClassDeclaration } from 'ts-morph';
import { createModelGraph } from './model-graph'
import { Model, GetModelFromNode } from './model'

const modelGraph = createModelGraph();

type Method = { 
    name: string
    returnModel: Model 
}

export type Controller = {
    name: string;
    methods: Method[];
}

export function getControllersAndModels(glob: string) {
    const project = new Project({});
    
    project.addExistingSourceFiles(glob);
    
    const sourceFiles = project.getSourceFiles();

    return {
        controllers: sourceFiles.map(x => getControllers(x, modelGraph.getOrAdd)).flat(),
        models: modelGraph.getAll()
    };
}

function getControllers (sourceFile: SourceFile, getModel: GetModelFromNode): Controller[] {
    return sourceFile.getClasses().filter(isControllerClass).map(cd => ({
        name: cd.getNameOrThrow(),
        methods: cd.getMethods().map(md => ({
            name: md.getName(),
            returnModel: getModel(md.getReturnTypeNodeOrThrow())
        }))
    }));
}

function isControllerClass(declaration: ClassDeclaration): boolean {
    const name = declaration.getName();
    return name !== undefined && name.endsWith('Controller');
}