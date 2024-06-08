import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { TypeORMFilter } from '@libs/commons/filters/orm.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Quiz application')
    .addBearerAuth()
    .setDescription('Realtime quiz application!')
    .setVersion('1.0')
    .addTag('Quiz')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;

  app.useGlobalFilters(new TypeORMFilter());

  await app.listen(port);

  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
  Logger.debug(`Swagger running on http://localhost:${port}/docs`, `Bootstrap`);
  Logger.debug(
    `BullBoard running on http://localhost:${port}/queues`,
    `Bootstrap`,
  );
}

bootstrap();
