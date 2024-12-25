import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const configService = app.get(ConfigService);
 

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Voucher Pool API documentation')
    .setDescription('Voucher Pool RESTful API documentation.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
//for swagger
  SwaggerModule.setup('api-docs', app, document);
//openapi
  app.getHttpAdapter().get('/api-docs-json', (req, res) => {
    res.json(document);
  });


  const port = configService.get('PORT') ?? 3000;

  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
