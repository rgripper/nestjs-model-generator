import { Company } from "./testModel";
import { RecursiveModel } from "./testRecursiveModel";
import { Controller, Get } from "@nestjs/common";
import { Address } from "../generated/models/Address";

@Controller('addresses')
export class AddressController {
    @Get()
    getAddress(id: string): Address {
        return {
            countryCode: 'Haha'
        };
    }
}

@Controller()
export class RecursiveModelController {
    getRecursiveModel(id: string): RecursiveModel {
        return null as any;
    }
}