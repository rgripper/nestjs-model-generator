import { generateAllFiles } from "./codegen/codegen-helper";
import path from 'path';
import { readFileSync } from "fs";

export type CodegenSettings = {
    tsConfigFilePath: string;
    modelsDir: string;
    routeInterceptorPath: string;
    modelTemplate: string;
    routeInterceptorTemplate: string;
}

const generatedDirectory = 'test/generated';
const tsConfigFilePath = "test/samples/tsconfig.json";

const codegenSettings: CodegenSettings = {
    tsConfigFilePath,
    modelsDir: path.posix.join(generatedDirectory, 'models'),
    routeInterceptorPath: path.posix.join(generatedDirectory, 'route-interceptor.ts'),
    modelTemplate: readFileSync('src/codegen/model.hbs').toString(),
    routeInterceptorTemplate: readFileSync('src/codegen/route-interceptor.hbs').toString()
}

console.log('before generateAllFiles', new Date())
generateAllFiles(codegenSettings);
console.log('after generateAllFiles', new Date())