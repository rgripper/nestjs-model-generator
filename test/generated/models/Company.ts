import { Employee } from './Employee';
import { Address } from './Address';
import { Anonynous_6454953b954942968f0247991d513a30e634031c946cddf65a3fbe049f882600 } from './Anonynous_6454953b954942968f0247991d513a30e634031c946cddf65a3fbe049f882600';
export class Company {

    constructor(raw: Company) {
        this.employees = raw.employees;
        this.hqAddress = new Address(raw.hqAddress);
        this.someField = new Anonynous_6454953b954942968f0247991d513a30e634031c946cddf65a3fbe049f882600(raw.someField);
    }

    employees!: Employee[];
    hqAddress!: Address;
    someField!: Anonynous_6454953b954942968f0247991d513a30e634031c946cddf65a3fbe049f882600;
}