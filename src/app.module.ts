import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from './character/character.module';
import { LocationModule } from './location/location.module';
import { ApiTokenModule } from './api-token/api-token.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.STAGE === 'prod' ? true : false,
    }),

    CharacterModule,

    LocationModule,

    ApiTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
