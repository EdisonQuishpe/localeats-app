import { Test, TestingModule } from '@nestjs/testing';
import { SupportServiceController } from './support-service.controller';
import { SupportServiceService } from './support-service.service';

describe('SupportServiceController', () => {
  let supportServiceController: SupportServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SupportServiceController],
      providers: [SupportServiceService],
    }).compile();

    supportServiceController = app.get<SupportServiceController>(SupportServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(supportServiceController.getHello()).toBe('Hello World!');
    });
  });
});
