import { Type, TypeFormatFlags, ts } from "ts-morph";
import crypto from 'crypto';
const hash = crypto.createHash('sha256');

export function isBuiltInType(type: Type) {
    return !type.isArray() && !type.getSymbol() && !type.getAliasSymbol();
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
    return 'Anonynous_' + hash.update(type.getText(undefined, TypeFormatFlags.None)).digest('hex');
}