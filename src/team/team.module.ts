import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { DatabaseService } from 'src/database/database.service';
import { S3Service } from 'src/s3/s3.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TeamController],
  providers: [TeamService,DatabaseService,S3Service,JwtService],
})
export class TeamModule {}
