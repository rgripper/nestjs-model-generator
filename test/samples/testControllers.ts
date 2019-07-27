import { Company } from "./testModel";
import { RecursiveModel } from "./testRecursiveModel";
import { Controller, Get } from "@nestjs/common";

@Controller('companies')
export class CompanyController {
    @Get()
    getCompany(id: string): Company {
        return null as any;
    }
}

@Controller()
export class RecursiveModelController {
    getRecursiveModel(id: string): RecursiveModel {
        return null as any;
    }
}