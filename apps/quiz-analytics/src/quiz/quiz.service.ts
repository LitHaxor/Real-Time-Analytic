import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { QuizResult } from './entities/result.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
  ) {}
  create(createQuizDto: CreateQuizDto) {
    return this.quizRepository.save(createQuizDto);
  }

  async findAll() {
    const quizesByUser = await this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .getMany();

    return quizesByUser;
  }

  findOne(id: string) {
    return this.quizRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateQuizDto: UpdateQuizDto) {
    return this.quizRepository.update(id, updateQuizDto);
  }

  remove(id: number) {
    return this.quizRepository.delete(id);
  }

  // Quiz Result

  async startQuiz(quizId: string, userId: string) {
    const result = await this.quizResultRepository.save({
      quizId,
      userId,
      score: 0,
      startTime: new Date(),
    });

    const response: Record<string, any> = {};

    const questions = await this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .where('quiz.id = :id', { id: quizId })
      .getOne();

    response.questions = questions.questions;
    response.quizId = quizId;
    response.resultId = result.id;

    return response;
  }

  async endQuiz(quizId: string, userId: string) {
    const quizResult = await this.quizResultRepository.findOne({
      where: { quizId, userId },
    });

    quizResult.endTime = new Date();
    return this.quizResultRepository.save(quizResult);
  }

  async getQuizResult(quizId: string, id: string) {
    return this.quizResultRepository.findOne({
      where: { quizId, userId: id },
    });
  }

  getResults(userId: string) {
    return this.quizResultRepository.find({
      where: { userId },
    });
  }

  async getLeaderboard(quizId: string) {
    const results = await this.quizResultRepository.find({
      where: { quizId },
      order: {
        score: 'DESC',
      },
    });

    return results;
  }
}
