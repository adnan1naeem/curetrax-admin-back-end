import { Controller, UseInterceptors , UploadedFile ,Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/home.dto';
import { DatabaseService } from 'src/database/database.service';
import { UpdateHomeDto } from './dto/update-home.dto';
import {JwtAuthGuard} from '../jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService,private readonly prisma: DatabaseService) {}

  @Post('upsert')
  @UseInterceptors(FileInterceptor('image'))
  async upsert(
    @Query('sectionName') sectionName: string, 
    @Body() createHomeDto: CreateHomeDto,
    @UploadedFile() imageUrl: Express.Multer.File,
  ) {
    if (!sectionName) {
      throw new BadRequestException('sectionName is required');
    }
  
    // If id is not provided in the body, use the id from the URL
    const homeId = createHomeDto.id; 
  
    return this.homeService.upsert(homeId, sectionName, createHomeDto, imageUrl);
  }

  @Get('all')
  async getAll(@Query('sectionName') sectionName: string) {
    if (!sectionName) {
      throw new BadRequestException('sectionName is required');
    }
    return this.homeService.getAll(sectionName);
  }

  @Delete()
  async deleteRecord(@Query('id') id: string) {
    const modelName = 'home'; 
    return this.prisma.deleteRecord(modelName, id);
  }
}
