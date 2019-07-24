import { Module, Controller, Get } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Controller()
export class AppController {
  
  @Get()
  getHello(): string {
    return 'Hello!';
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
