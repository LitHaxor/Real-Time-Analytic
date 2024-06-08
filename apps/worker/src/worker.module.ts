import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResultWorkerModule } from './result-worker/result-worker.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService?.get('DB_HOST'),
        port: configService?.get('DB_PORT'),
        username: configService?.get('DB_USER'),
        password: configService?.get('DB_PASSWORD'),
        database: configService?.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ResultWorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class WorkerModule {}
