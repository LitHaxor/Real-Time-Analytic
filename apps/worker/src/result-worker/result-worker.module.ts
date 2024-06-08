import { Queues } from '@libs/commons/queues/names';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ResultWorkerService } from './result-worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionResponse } from 'apps/quiz-analytics/src/responses/entities/response.entity';
import { Question } from 'apps/quiz-analytics/src/questions/entities/question.entity';
import { QuizResult } from 'apps/quiz-analytics/src/quiz/entities/result.entity';
import { Quiz } from 'apps/quiz-analytics/src/quiz/entities/quiz.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionResponse, Question, QuizResult, Quiz]),
    BullModule.registerQueue({
      name: Queues.RESULT_QUEUE,
    }),
  ],
  controllers: [],
  providers: [ResultWorkerService],
})
export class ResultWorkerModule {}
