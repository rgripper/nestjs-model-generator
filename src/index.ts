import { generateAllFiles } from "./codegen/codegen-helper";
import path from 'path';
import { readFileSync } from "fs";

export type CodegenSettings = {
    inputFilesGlob: string;
    modelsDir: string;
    routeInterceptorPath: string;
    modelTemplate: string;
    routeInterceptorTemplate: string;
}

const generatedDirectory = 'test/generated';
const inputFilesGlob = "test/samples/*.ts";

const codegenSettings = {
    inputFilesGlob,
    modelsDir: path.join(generatedDirectory, 'models'),
    routeInterceptorPath: path.join(generatedDirectory, 'route-interceptor.ts'),
    modelTemplate: readFileSync('src/codegen/model.hbs').toString(),
    routeInterceptorTemplate: readFileSync('src/codegen/route-interceptor.hbs').toString()
}

generateAllFiles(codegenSettings);