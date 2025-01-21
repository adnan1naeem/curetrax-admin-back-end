import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard'; // Adjust import paths
import { TimelineService } from './timeline.service';
import { UpsertTimelineDto } from './dto/create-timeline.dto';
import { DatabaseService } from 'src/database/database.service';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService,private readonly prisma: DatabaseService) {}

  @Post('upsert')
  @UseInterceptors(FileInterceptor('image'))
  upsert(
    @Query('sectionName') sectionName: string,
    @Body() upsertTimelineDto: UpsertTimelineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.timelineService.upsert(upsertTimelineDto,sectionName, image);
  }

  @Get('all')
  findAll(@Query('sectionName') sectionName: string) {
    if (!sectionName) {
      throw new BadRequestException('Section name is required.');
    }
    return this.timelineService.getSectionData(sectionName);
  }

  @Delete()
  async deleteRecord(@Query('id') id: string) {
    const modelName = 'timeline';
    return this.prisma.deleteRecord(modelName, id);
  }
}
