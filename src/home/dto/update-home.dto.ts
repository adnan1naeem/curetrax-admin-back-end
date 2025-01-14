import { IsString, IsOptional } from 'class-validator';

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  button?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  section?: string;
}