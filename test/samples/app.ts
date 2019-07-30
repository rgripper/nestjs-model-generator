import { Module } from '@nestjs/common';
import { QuestionController, RecursiveModelController } from './testControllers';

@Module({
  imports: [],
  controllers: [QuestionController, RecursiveModelController],
  providers: [],
})
export class AppModule {}
