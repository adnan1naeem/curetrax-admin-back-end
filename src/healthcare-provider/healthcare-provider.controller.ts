import { Controller, Get, Post, Body, Query, Put } from '@nestjs/common';
import { HealthCareProviderService } from './healthcare-provider.service';
import { CreateOrUpdateHealthCareProviderDto } from './dto/create-healthcare-provider.dto';

@Controller('healthcare-providers')
export class HealthCareProviderController {
  constructor(private readonly healthCareProviderService: HealthCareProviderService) {}

  // API to create or update a HealthCareProvider
  @Post('upsert')
  async createOrUpdate(
    @Query('sectionName') sectionName: string,
    @Body() createOrUpdateDto: CreateOrUpdateHealthCareProviderDto,
  ) {
    return this.healthCareProviderService.upsert(sectionName, createOrUpdateDto);
  }

  // API to fetch all HealthCareProviders for a section
  @Get('all')
  async getAll(@Query('sectionName') sectionName: string) {
    return this.healthCareProviderService.findAll(sectionName);
  }
}