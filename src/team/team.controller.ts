import { Controller, Post, Body, UploadedFile, UseInterceptors, Get, Param, Patch,Delete ,BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTeamDto,UpdateTeamDto } from './dto/team.dto';
import { TeamService } from './team.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageUrl')) 
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @UploadedFile() imageUrl: Express.Multer.File
  ) {

    return this.teamService.createTeamMember(createTeamDto,imageUrl);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return this.teamService.getAllTeamMembers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. ID must be a number.');
    }
    return this.teamService.getTeamMemberById(numericId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageUrl'))  
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,  
    @UploadedFile() imageUrl: Express.Multer.File, 
  ) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. ID must be a number.');
    }
    return this.teamService.updateTeamMember(numericId, updateTeamDto,imageUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTeamMember(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. ID must be a number.');
    }    
    return this.teamService.deleteTeamMember(numericId);
  }
}
