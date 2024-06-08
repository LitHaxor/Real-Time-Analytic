import { BaseEntity } from '@libs/commons/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { QuizResult } from '../../quiz/entities/result.entity';

@Entity({
  name: 'question_responses',
})
export class QuestionResponse extends BaseEntity {
  @Column({
    name: 'question_id',
  })
  questionId: string;

  @Column()
  response: string;

  @Column({
    name: 'quiz_id',
  })
  quizId: string;

  @Column({
    name: 'is_correct',
    type: 'boolean',
    nullable: true,
  })
  isCorrect: boolean;

  @Column({
    name: 'user_id',
    default: '1',
  })
  userId: string;

  @Column({
    name: 'result_id',
  })
  resultId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.responses)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => QuizResult, (result) => result.responses)
  @JoinColumn({ name: 'result_id' })
  result: QuizResult;
}
