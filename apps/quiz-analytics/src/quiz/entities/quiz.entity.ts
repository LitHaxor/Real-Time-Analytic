import { BaseEntity } from '@libs/commons/entity/base.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuestionResponse } from '../../responses/entities/response.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { QuizResult } from './result.entity';

@Entity()
export class Quiz extends BaseEntity {
  @Column()
  @Index('quiz_name_index')
  name: string;

  @Column()
  description: string;

  @Column({
    nullable: true,
    type: 'json',
  })
  topics: string[];

  @Column({
    name: 'user_id',
    default: '1',
  })
  userId: string;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @OneToMany(() => QuestionResponse, (responses) => responses.quiz)
  responses: QuestionResponse[];

  @OneToMany(() => QuizResult, (result) => result.quiz)
  results: QuizResult[];
}
