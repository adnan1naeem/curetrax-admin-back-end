import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareProviderController } from './healthcare-provider.controller';
import { HealthcareProviderService } from './healthcare-provider.service';

describe('HealthcareProviderController', () => {
  let controller: HealthcareProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthcareProviderController],
      providers: [HealthcareProviderService],
    }).compile();

    controller = module.get<HealthcareProviderController>(HealthcareProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
