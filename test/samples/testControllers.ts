import { Company, Address, CountryCode, Question } from "./testModel";
import { RecursiveModel } from "./testRecursiveModel";
import { Controller, Get } from "@nestjs/common";


@Controller('questions')
export class QuestionController {
    @Get()
    getAddress(id: string): Question {
        return {
            text: 'Name your favourite can opener brand'
        };
    }
}

@Controller()
export class RecursiveModelController {
    getRecursiveModel(id: string): RecursiveModel {
        return null as any;
    }
}