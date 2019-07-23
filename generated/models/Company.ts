import { Employee } from './Employee';
import { Address } from './Address';
import { TODO:anonymous } from './TODO:anonymous';

export class Company {
    employees: Employee[];
    hqAddress: Address;
    someField: { value: number; };
}