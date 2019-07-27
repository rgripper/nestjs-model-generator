import { CountryCode } from './CountryCode';
export class Address {

    constructor(raw: Address) {
        this.countryCode = new CountryCode(raw.countryCode);
    }

    countryCode!: CountryCode;
}