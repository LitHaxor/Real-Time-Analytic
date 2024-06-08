import { BaseEntity } from '@libs/commons/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'permissions',
})
export class Permission extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;
}
