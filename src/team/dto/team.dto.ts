import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  profession: string;

  @IsOptional()
  @IsString()
  linkedinUrl: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  imageUrl?: any;  
  
  @IsOptional()
  @IsString()
  googleScholar?: string;

  @IsOptional()
  @IsString()
  researchGate?: string;
}

export class UpdateTeamDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    profession?: string;
  
    @IsOptional()
    @IsString()
    linkedinUrl?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
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