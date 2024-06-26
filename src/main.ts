import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CronService } from './utils/cronService';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Fitness+ API description and usage')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const seeder = app.get(SeederService);

  const cron = app.get(CronService);
  cron.handleCron();

  await seeder.seed();
  await app.listen(3000);
};

bootstrap();
