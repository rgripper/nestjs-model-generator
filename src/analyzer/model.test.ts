import { isOptionalPropertySignature } from "./model";
import { Project, SourceFile, SyntaxKind, ts } from "ts-morph";
import { isBuiltInType } from "./type-helper";

describe(isOptionalPropertySignature.name, () => {
    it.each<[string,boolean]>([
        ['?: undefined | string'  , true],
        ['?: string'              , true],
        [': undefined | string'   , true],
        [': undefined'            , true],

        [': string'               , false],
        [': string | number'      , false],
        [': null | number'        , false],
    ])('Detects optional property', (propertySyntax, expectedResult) => {
        const sf = createSourceFile(`
            interface Pet {
                name${propertySyntax};
            }
        `);

        const propNode = sf.getInterfaceOrThrow('Pet').getPropertyOrThrow('name');
        expect(isOptionalPropertySignature(propNode)).toBe(expectedResult);
    })
})

describe(isBuiltInType.name, () => {
    it.each([
        'boolean',
        'string',
        'number',
        'number[]',
        '55',
        '"asastring"',
        'null',
    ])('Detects %s built-in type', (typeKeyword) => {
        const sf = createSourceFile(`interface Pet { prop: ${typeKeyword} }`);
        const type = sf.getInterfaceOrThrow('Pet').getPropertyOrThrow('prop').getTypeNodeOrThrow().getType();
        expect(isBuiltInType(type)).toBe(true);
    })

    it('Detects interface as custom type', () => {
        const type = createSourceFile().addInterface({ name: 'Pet' }).getDescendantsOfKind(ts.SyntaxKind.Identifier)[0].getType();
        expect(isBuiltInType(type)).toBe(false);
    })

    it('Detects type alias as custom type', () => {
        const type = createSourceFile().addTypeAlias({ 
            name: 'Pet', 
            type: "{ prop: string }"
        }).getDescendantsOfKind(ts.SyntaxKind.Identifier)[0].getType();
        expect(isBuiltInType(type)).toBe(false);
    })

    it('Detects class as custom type', () => {
        const type = createSourceFile().addClass({ name: 'Pet' }).getDescendantsOfKind(ts.SyntaxKind.Identifier)[0].getType();
        expect(isBuiltInType(type)).toBe(false);
    })
})

function createSourceFile(script?: string): SourceFile {
    const project = new Project({ compilerOptions: { strict: true } });
    return project.createSourceFile('fake-path', script, { scriptKind: ts.ScriptKind.TS });
}