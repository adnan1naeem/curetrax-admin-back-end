import { IsString, IsOptional } from 'class-validator';

export class CreateOrUpdateHealthCareProviderDto {
  @IsString()
  sectionName: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  id?: string;
}