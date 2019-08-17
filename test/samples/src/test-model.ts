export interface Company {
    employees: Employee[];
    hqAddress: Address;
    someField: { value: number };
}

interface Employee {
    name: string;
    age: number;
    phoneNumbers: string[];
    employmentType: EmploymentType;
}

type QuestionOption = { 
    text: string; 
    value: unknown; 
}

export type Question = {
    text: string;
    isMulti?: boolean;
    options: QuestionOption[];
}

export type Address = {
    countryCode: CountryCode;
}

export enum CountryCode { Australia, Denmark, Croatia }

type EmploymentType = 'Permanent' | 'Contractor'

