import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard'; // Adjust import paths
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createTimelineDto: CreateTimelineDto, @UploadedFile() image: Express.Multer.File) {
    return this.timelineService.create(createTimelineDto, image);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('sectionName') sectionName: string) {
    if (!sectionName) {
      throw new BadRequestException('Section name is required.');
    }
    return this.timelineService.getSectionData(sectionName);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Query('sectionName') sectionName: string,
    @Body() updateTimelineDto: UpdateTimelineDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    if (!sectionName) {
      throw new BadRequestException('Section name is required.');
    }
    return this.timelineService.update(+id, sectionName, updateTimelineDto, image);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Param('sectionName') sectionName: string) {
    return this.timelineService.remove(+id, sectionName);
  }
}
