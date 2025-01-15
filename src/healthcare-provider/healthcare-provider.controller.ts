import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard'; // Update path if necessary
import { HealthCareProviderService } from './healthcare-provider.service';
import { CreateHealthCareProviderDto } from './dto/create-healthcare-provider.dto';
import { UpdateHealthCareProviderDto } from './dto/update-healthcare-provider.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('healthcare-provider')
export class HealthCareProviderController {
  constructor(private readonly healthCareProviderService: HealthCareProviderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createHealthCareProviderDto: CreateHealthCareProviderDto) {
    return this.healthCareProviderService.create(createHealthCareProviderDto);
  }

  @Get(':sectionName')
  findAll(@Param('sectionName') sectionName: string) {
    return this.healthCareProviderService.findAll(sectionName);
  }

  @Put(':id/:sectionName')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Param('sectionName') sectionName: string,
    @Body() updateHealthCareProviderDto: UpdateHealthCareProviderDto,
  ) {
    return this.healthCareProviderService.update(+id, sectionName, updateHealthCareProviderDto);
  }

  @Delete(':id/:sectionName')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Param('sectionName') sectionName: string) {
    return this.healthCareProviderService.remove(+id, sectionName);
  }
}
