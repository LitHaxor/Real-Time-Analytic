import { BaseEntity } from '@libs/commons/entity/base.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';

@Entity()
export class Question extends BaseEntity {
  @Column()
  @Index()
  title: string;

  @Column({
    type: 'json',
    default: [],
  })
  choices: string[];

  @Column()
  @Exclude()
  answer: string;

  @Column({
    name: 'quiz_id',
  })
  @Index('quiz_id_index')
  quizId: string;

  @Column({
    name: 'user_id',
    default: '1',
  })
  userId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}
