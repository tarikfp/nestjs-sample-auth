import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users[0]) {
      throw new BadRequestException('Email is already in use');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return await this.usersService.create(email, hashedPassword);
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new BadRequestException('Password is wrong');
    }
    return user;
  }
}
