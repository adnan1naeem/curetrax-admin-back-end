import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';

export class UpsertProductDto {
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

  @IsInt()
  @IsOptional()
  id?: number;  // Make id optional
}