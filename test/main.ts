import { NestFactory } from '@nestjs/core';
import { AppModule } from './samples/app';
import { RouteInterceptor } from './generated/route-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new RouteInterceptor());
  await app.listen(3000);
}
bootstrap();
