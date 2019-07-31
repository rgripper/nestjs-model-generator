import { Module } from '@nestjs/common';
import { QuestionController } from './test-controllers';

@Module({
    imports: [],
    controllers: [QuestionController],
    providers: [],
})
export class AppModule {}
