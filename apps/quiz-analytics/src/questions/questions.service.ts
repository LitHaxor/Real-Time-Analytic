import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    return this.questionRepository.save(createQuestionDto);
  }

  findAll() {
    return this.questionRepository.find();
  }

  findOne(id: string) {
    return this.questionRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.questionRepository.update(id, updateQuestionDto);
  }

  remove(id: string) {
    return this.questionRepository.softDelete(id);
  }
}
