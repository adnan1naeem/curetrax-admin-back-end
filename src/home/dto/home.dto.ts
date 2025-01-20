import { IsString, IsOptional } from 'class-validator';

export class CreateHomeDto {
  @IsString()
  sectionName: string;

  @IsString()
  @IsOptional()
  heading?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  button?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  id?: string; // Make id optional in the body
}
