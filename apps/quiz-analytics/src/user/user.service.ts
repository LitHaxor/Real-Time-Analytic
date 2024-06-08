import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Permission } from './entities/permission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['permissions'],
    });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['permissions'],
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async comparePassword(userPass: string, dbPass: string) {
    return await argon2.verify(dbPass, userPass);
  }

  generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      permissions: user.permissions,
    };

    return jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '1d',
    });
  }

  async addPermissionToUser(userId: string, permissionId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['permissions'],
    });
    const permission = await this.permissionRepository.findOne({
      where: {
        id: permissionId,
      },
    });

    user.permissions.push(permission);

    return this.userRepository.save(user);
  }

  async removePermissionFromUser(userId: string, permissionId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['permissions'],
    });

    user.permissions = user.permissions.filter(
      (permission) => permission.id !== permissionId,
    );

    return this.userRepository.save(user);
  }

  async getPermissions(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['permissions'],
    });

    return user.permissions;
  }

  async createPermission(permission: Permission) {
    return this.permissionRepository.save(permission);
  }

  async getAllPermissions() {
    return this.permissionRepository.find();
  }
}
