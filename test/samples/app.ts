import { Module } from '@nestjs/common';
import { CompanyController, RecursiveModelController } from './testControllers';

type Answer = {
  text: string;
}

@Module({
  imports: [],
  controllers: [CompanyController, RecursiveModelController],
  providers: [],
})
export class AppModule {}
