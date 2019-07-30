import { Module } from '@nestjs/common';
import { QuestionController } from './testControllers';

@Module({
  imports: [],
  controllers: [QuestionController],
  providers: [],
})
export class AppModule {}
