import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokenController } from './api-token.controller';
import { ApiTokenService } from './api-token.service';

describe('ApiTokenController', () => {
  let controller: ApiTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTokenController],
      providers: [ApiTokenService],
    }).compile();

    controller = module.get<ApiTokenController>(ApiTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
