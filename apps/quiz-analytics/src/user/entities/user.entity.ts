import { BaseEntity } from '@libs/commons/entity/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: 'user',
  })
  role: string;

  @ManyToMany(() => Permission, {
    cascade: true,
  })
  @JoinTable()
  permissions: Permission[];
}
