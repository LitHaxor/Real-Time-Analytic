import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/Login.dto';
import { RegisterUserDto } from './dto/Register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login({ email, password }: LoginUserDto) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const isPasswordValid = await this.userService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const acesssToken = this.userService.generateToken(user);

    return { acesssToken };
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.userService.create(user);

    if (!newUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return {
      status: 'success',
      requiredLogin: true,
      message: 'User created successfully',
    };
  }
}
