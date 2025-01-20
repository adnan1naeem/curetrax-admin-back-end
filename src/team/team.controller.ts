import { Controller, Post, Body, UploadedFile, UseInterceptors, Get, Param, Patch,Delete ,BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpsertTeamDto } from './dto/team.dto';
import { TeamService } from './team.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('upsert')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageUrl')) 
  async create(
    @Body() createTeamDto: UpsertTeamDto,
    @UploadedFile() imageUrl: Express.Multer.File
  ) {

    return this.teamService.upsertTeamMember(createTeamDto,imageUrl);
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

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async deleteTeamMember(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. ID must be a number.');
    }    
    return this.teamService.deleteTeamMember(numericId);
  }
}
