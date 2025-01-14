import { Module } from '@nestjs/common';
import { HealthCareProviderService } from './healthcare-provider.service';
import { HealthCareProviderController } from './healthcare-provider.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [HealthCareProviderController],
  providers: [HealthCareProviderService,DatabaseService,JwtService],
})
export class HealthcareProviderModule {}
