export interface Company {
    employees: Employee[]
    hqAddress: Address
}

interface Employee {
    name: string
    age: number
    phoneNumbers: string[]
    employmentType: EmploymentType
}

type Address = {
    countryCode: CountryCode
}

enum CountryCode { Australia, Denmark, Croatia }

type EmploymentType = 'Permanent' | 'Contractor'

