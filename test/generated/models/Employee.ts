export class Employee {

    constructor(raw: Employee) {
        this.name = raw.name;
        this.age = raw.age;
        this.phoneNumbers = raw.phoneNumbers;
        this.employmentType = raw.employmentType;
    }

    name!: string;
    age!: number;
    phoneNumbers!: string[];
    employmentType!: EmploymentType;
}