import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  Session,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user-dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/')
  async getAuthUser(@Session() session: any) {
    const user = await this.usersService.findOne(session.userId);
    if (!user) {
      throw new NotFoundException('Auth user not found');
    }
    return user;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
