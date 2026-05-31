import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = NestFactory.create(AppModule);

  (await app).enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  (await app).setGlobalPrefix('api');
  (await app).listen(process.env.PORT || 4000);

  console.log(`🚀 CortexaMonitor API running on port ${process.env.PORT || 4000}`);
}
bootstrap();
