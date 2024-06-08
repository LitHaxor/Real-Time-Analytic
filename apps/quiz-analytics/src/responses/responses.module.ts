import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionResponse } from './entities/response.entity';
import { BullModule } from '@nestjs/bull';
import { Queues } from '@libs/commons/queues/names';
import { JwtModule } from '@nestjs/jwt';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { Question } from '../questions/entities/question.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    BullModule.registerQueue({
      name: Queues.RESULT_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: Queues.RESULT_QUEUE,
      adapter: BullMQAdapter,
    }),
    TypeOrmModule.forFeature([QuestionResponse, Question]),
  ],

  controllers: [ResponsesController],
  providers: [ResponsesService],
})
export class ResponsesModule {}
