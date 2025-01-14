import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsString()
  sectionName: string;

  @IsString()
  @IsOptional()
  heading?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['allo', 'car19'])
  pagename: 'allo' | 'car19';
}