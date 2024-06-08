import { Queues } from '@libs/commons/queues/names';
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'apps/quiz-analytics/src/questions/entities/question.entity';
import { QuizResult } from 'apps/quiz-analytics/src/quiz/entities/result.entity';
import { QuestionResponse } from 'apps/quiz-analytics/src/responses/entities/response.entity';
import { Job } from 'bull';
import { Repository } from 'typeorm';

@Injectable()
@Processor(Queues.RESULT_QUEUE)
export class ResultWorkerService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuizResult)
    private readonly resultRepository: Repository<QuizResult>,
  ) {}

  @Process('processResult')
  async handleResult(result: Job<QuestionResponse>) {
    const { data } = result;
    const question = await this.questionRepository.findOne({
      where: {
        id: data.questionId,
      },
    });
    const quizResult = await this.resultRepository.findOne({
      where: {
        id: data.resultId,
      },
    });

    const isCorrect = question.answer === data.response;

    quizResult.score += isCorrect ? 1 : 0;

    return await this.resultRepository.save(quizResult);
  }
}
