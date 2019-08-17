import { Type, TypeFormatFlags, ts } from "ts-morph";
import crypto from 'crypto';

export function isBuiltInType(type: Type): boolean {
    return type.isArray() || type.isLiteral() || type.isString() || type.isNumber() || type.isBoolean() || type.isNull() || type.isUnknown(); // TODO: temp until actual fix
}

export function getTypeName(type: Type) {
    return isAnonymousType(type) 
        ? getAnonymousTypeName(type)
        : type.getText(undefined, TypeFormatFlags.None)
}

function isAnonymousType(type: Type) {
    return type.isAnonymous() && !type.compilerType.aliasSymbol;
}

function getAnonymousTypeName(type: Type) {
    const hash = crypto.createHash('sha256');
    return 'Anonynous_' + hash.update(type.getText(undefined, TypeFormatFlags.None)).digest('hex');
}