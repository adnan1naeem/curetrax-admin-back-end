import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  heading?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['allo', 'car19'])
  @IsOptional()
  pagename?: 'allo' | 'car19';
}