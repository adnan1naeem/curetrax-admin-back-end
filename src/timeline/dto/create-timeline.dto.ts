import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class UpsertTimelineDto {
  @IsInt()
  @IsOptional()
  id?: string; // Optional ID for update operations

  @IsString()
  sectionName: string; // Required

  @IsString()
  @IsOptional()
  heading?: string;

  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  imagePath?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
