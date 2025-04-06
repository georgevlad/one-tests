import { Test, TestingModule } from '@nestjs/testing';
import { UberController } from './uber.controller';

describe('UberController', () => {
  let controller: UberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UberController],
    }).compile();

    controller = module.get<UberController>(UberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
