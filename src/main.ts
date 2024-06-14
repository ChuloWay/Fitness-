import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
  });

  const seeder = app.get(SeederService);

  await seeder.seed();
  await app.listen(3000);
};

bootstrap();
