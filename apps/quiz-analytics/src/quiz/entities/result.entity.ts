import { QuestionResponse } from '../../responses/entities/response.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity({
  name: 'quiz_results',
})
export class QuizResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'quiz_id',
  })
  quizId: string;

  @Column('float')
  score: number;

  @CreateDateColumn({
    name: 'start_time',
  })
  startTime: Date;

  @Column('timestamptz', {
    name: 'end_time',
    nullable: true,
  })
  endTime: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.results)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @OneToMany(
    () => QuestionResponse,
    (QuestionResponse) => QuestionResponse.result,
  )
  responses: QuestionResponse[];
}
