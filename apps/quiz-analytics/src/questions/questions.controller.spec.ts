import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionsController', () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [QuestionsService],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a question', () => {
    const question: CreateQuestionDto = {
      question: 'What is the capital of Nigeria?',
      choices: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
      answer: 'Abuja',
    };
    expect(controller.create(question)).toEqual(question);
  });

  it('should get all questions', () => {
    expect(controller.findAll()).toEqual([]);
  });

  it('should get a question by id', () => {
    const question: CreateQuestionDto = {
      question: 'What is the capital of Nigeria?',
      choices: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
      answer: 'Abuja',
    };
    controller.create(question);
    expect(controller.findOne('1')).toEqual(question);
  });

  it('should update a question', () => {
    const question: CreateQuestionDto = {
      question: 'What is the capital of Nigeria?',
      choices: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
      answer: 'Abuja',
    };
    controller.create(question);
    expect(controller.update('1', question)).toEqual(question);
  });

  it('should delete a question', () => {
    const question: CreateQuestionDto = {
      question: 'What is the capital of Nigeria?',
      choices: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
      answer: 'Abuja',
    };
    controller.create(question);
    expect(controller.remove('1')).toEqual({ deleted: true });
  });
});
