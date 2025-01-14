import { IsString, IsDateString } from 'class-validator';

export class CreateTimelineDto {
  @IsString()
  sectionName: string;

  @IsString()
  heading: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  image: string;
}
