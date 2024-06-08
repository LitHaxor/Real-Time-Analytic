import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionResponse } from './entities/response.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queues } from '@libs/commons/queues/names';
import { Queue } from 'bull';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(QuestionResponse)
    private readonly responseRepository: Repository<QuestionResponse>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectQueue(Queues.RESULT_QUEUE)
    private readonly resultQueue: Queue<QuestionResponse>,
  ) {}

  async create(createResponseDto: CreateResponseDto, userId: string) {
    const { questionId } = createResponseDto;

    const question = await this.questionRepository.findOne({
      where: {
        id: questionId,
      },
    });

    const alreadyAnswered = await this.responseRepository.findOne({
      where: {
        questionId,
        userId: userId,
      },
    });

    if (alreadyAnswered) {
      return new HttpException(
        {
          error: 'You have already answered this question',
        },
        HttpStatus.AMBIGUOUS,
      );
    }

    const response = this.responseRepository.create({
      ...createResponseDto,
      questionId: questionId,
      quizId: question.quizId,
      userId,
    });
    const questionReponse = this.responseRepository.save(response);

    await this.sendToResultQueue(response);

    return questionReponse;
  }

  async sendToResultQueue(response: QuestionResponse) {
    await this.resultQueue.add('processResult', response);
  }

  findAll() {
    return this.responseRepository.find({
      relations: ['question', 'quiz'],
    });
  }

  findOne(id: string) {
    return this.responseRepository.findOne({
      where: { id },
      relations: ['question', 'quiz'],
    });
  }

  update(id: string, updateResponseDto: UpdateResponseDto) {
    return this.responseRepository.update(id, updateResponseDto);
  }

  remove(id: string) {
    return this.responseRepository.delete(id);
  }
}
