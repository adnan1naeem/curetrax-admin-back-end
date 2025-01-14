import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { S3Service } from 'src/s3/s3.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TimelineController],
  providers: [TimelineService,S3Service,DatabaseService,JwtService],
})
export class TimelineModule {}
