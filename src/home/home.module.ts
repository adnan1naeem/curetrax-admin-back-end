import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { DatabaseService } from 'src/database/database.service';
import { S3Service } from 'src/s3/s3.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [HomeController],
  providers: [HomeService ,DatabaseService , S3Service,JwtService],
})
export class HomeModule {}
