import { Company } from './models/Company';
import { RecursiveModel } from './models/RecursiveModel';

const controllers = {
    CompanyController: {
        getCompany: {
            returnType: Company
        },
    },
    RecursiveModelController: {
        getRecursiveModel: {
            returnType: RecursiveModel
        },
    },
}