import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateTimelineDto {
  @IsString()
  @IsOptional()
  sectionName?: string;

  @IsString()
  @IsOptional()
  heading?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
