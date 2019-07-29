import { Module } from '@nestjs/common';
import { AddressController, RecursiveModelController } from './testControllers';

@Module({
  imports: [],
  controllers: [AddressController, RecursiveModelController],
  providers: [],
})
export class AppModule {}
