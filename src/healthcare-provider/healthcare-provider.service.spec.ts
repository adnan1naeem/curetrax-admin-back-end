import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareProviderService } from './healthcare-provider.service';

describe('HealthcareProviderService', () => {
  let service: HealthcareProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthcareProviderService],
    }).compile();

    service = module.get<HealthcareProviderService>(HealthcareProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
