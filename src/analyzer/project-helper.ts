import { Project, SourceFile, ClassDeclaration } from 'ts-morph';
import { createModelGraph } from './model-graph'
import { Model, GetModelFromNode } from './model'

// TODO: move to a separate file
// TODO: refactor template-friendly serialization
const modelGraph = createModelGraph(({ model, isOptional, isNullable }) => {

    const getDeepArrayElementModel = (model: Model): Model => model.arrayElementModel ? getDeepArrayElementModel(model.arrayElementModel) : model;
    const deepArrayElementModel = getDeepArrayElementModel(model);

    return [{ 
        name: 'ApiModelProperty', 
        params: [{ 
            name: 'isArray',
            value: model.arrayElementModel !== undefined 
        }, {
            name: 'required',
            value: !isOptional
        }, {
            name: 'nullable',
            value: isNullable
        }, {
            name: 'type',
            value: deepArrayElementModel.isCustom ? deepArrayElementModel.name : undefined
        }].filter(x => !!x.value) // removes params with default (falsy) values
    }]
});

type Method = { 
    name: string;
    returnModel: Model; 
}

export type Controller = {
    name: string;
    methods: Method[];
}

export function getControllersAndModels(tsConfigFilePath: string) {
    const project = new Project({ tsConfigFilePath });
    
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