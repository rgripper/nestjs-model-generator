import { Question } from "./test-model";
import { Controller, Get } from "@nestjs/common";


@Controller('questions')
export class QuestionController {
    @Get()
    public getAddress(): Question {
        return {
            text: 'Name your favourite can opener brand'
        };
    }
}

// @Controller()
// export class RecursiveModelController {
//     getRecursiveModel(id: string): RecursiveModel {
//         return null as any;
//     }
// }