<<<<<<< Updated upstream
import { Controller, Post, Body, UploadedFile, UseInterceptors, Get, Param, Patch,Delete ,BadRequestException, UseGuards, Req } from '@nestjs/common';
=======
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
>>>>>>> Stashed changes
import { FileInterceptor } from '@nestjs/platform-express';
import { UpsertTeamDto } from './dto/team.dto';
import { DatabaseService } from 'src/database/database.service';
import { TeamService } from './team.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { join } from 'path';
import { diskStorage } from 'multer';
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService,private readonly prisma: DatabaseService) {}

  @Post('upsert')
<<<<<<< Updated upstream
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: join(__dirname, '../../uploads/teams'), // Path to upload folder
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = file.originalname.split('.').pop();
          callback(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
        },
      }),
    }),
  )
  async create(
    @Body() createTeamDto: UpsertTeamDto,
    @UploadedFile() imageUrl: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.teamService.upsertTeamMember(createTeamDto, imageUrl,req);
=======
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageUrl'))
  async create(
    @Body() createTeamDto: UpsertTeamDto,
    @UploadedFile() imageUrl: Express.Multer.File,
  ) {
    return this.teamService.upsertTeamMember(createTeamDto, imageUrl);
>>>>>>> Stashed changes
  }

  @Get('all')
  async getAll() {
    return this.teamService.getAllTeamMembers();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. ID must be a number.');
    }
    return this.teamService.getTeamMemberById(numericId);
  }

  @Delete()
  async deleteRecord(@Query('id') id: string) {
    const modelName = 'team';
    return this.prisma.deleteRecord(modelName, id);
  }
}
