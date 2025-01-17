import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpsertTeamDto {
  @IsOptional()
  @IsNumber()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  profession: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  imageUrl?: any;

  @IsOptional()
  @IsString()
  googleScholar?: string;

  @IsOptional()
  @IsString()
  researchGate?: string;
}
