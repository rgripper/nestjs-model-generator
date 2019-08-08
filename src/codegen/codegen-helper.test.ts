import { relativeImportedModuleName } from "./codegen-helper";

describe(relativeImportedModuleName.name, () => {
    it("should generate valid relative module name", () => {
        const expectedResult = "./some/importFrom";
        const actualResult = relativeImportedModuleName('test/generated/importTo', 'test/generated/some/importFrom');
        expect(actualResult).toBe(expectedResult);
    })
})