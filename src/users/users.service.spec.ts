import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],

      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
