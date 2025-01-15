import { Controller, UseInterceptors , UploadedFile ,Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import {JwtAuthGuard} from '../jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image')) 
  create(@Body() createHomeDto: CreateHomeDto,
  @UploadedFile() imageUrl: Express.Multer.File
  
) {
    return this.homeService.create(createHomeDto,imageUrl);
  }

  @Get()
  async getSections(@Query('sectionName') sectionName: string) {
    if (!sectionName) {
      throw new BadRequestException('sectionName is required');
    }
    return this.homeService.getSections(sectionName);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  async updateSection(
    @Param('id') id: string,
    @Query('sectionName') sectionName: string,
    @Body() updateHomeDto: UpdateHomeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    
    if (!sectionName || !id) {
      throw new BadRequestException('sectionName and id are required');
    }

    return this.homeService.updateSection(parseInt(id), sectionName, updateHomeDto, image);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Param('sectionName') sectionName: string) {
    return this.homeService.remove(+id, sectionName); // Pass the id and sectionName as arguments
  }
}
