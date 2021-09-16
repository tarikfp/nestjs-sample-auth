import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      login: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asd' }]);
      },
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asd', password: 'asd' });
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return user with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('find and return user with specific id', async () => {
    const user = await controller.findUser('3222');
    console.log(user);
    expect(user).toBeDefined();
  });

  it('login with email and password', async () => {
    const session = { userId: -1 };
    const user = await controller.login(
      { email: 'test@test.com', password: '12345' },
      session,
    );
    expect(user.id).toBe(1);
    expect(session.userId).toBe(1);
  });
});
