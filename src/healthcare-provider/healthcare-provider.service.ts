import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // Update based on your setup
import { CreateOrUpdateHealthCareProviderDto } from './dto/create-healthcare-provider.dto';

@Injectable()
export class HealthCareProviderService {
  constructor(private readonly prisma: DatabaseService) {}

  async upsert(
    sectionName: string,
    createOrUpdateDto?: CreateOrUpdateHealthCareProviderDto,
  ) {
    try {
      if (createOrUpdateDto) {
        const { id, ...updateData } = createOrUpdateDto; // Destructure id from DTO
  
        if (id) {
          // If id is provided, update the specific HealthCareProvider
          const existingHealthCareProvider = await this.prisma.healthCareProvider.findUnique({
            where: { id : parseInt(id) },
          });
  
          if (!existingHealthCareProvider) {
            throw new NotFoundException(`HealthCareProvider with id '${id}' not found.`);
          }
  
          // Update the existing record
          const updatedProvider = await this.prisma.healthCareProvider.update({
            where: { id : parseInt(id) },
            data: { ...updateData, sectionName },
          });
  
          return {
            message: 'HealthCareProvider updated successfully',
            data: updatedProvider,
          };
        } else {
          // If no id is provided, create a new HealthCareProvider
          const newProvider = await this.prisma.healthCareProvider.create({
            data: { ...updateData, sectionName },
          });
  
          return {
            message: 'HealthCareProvider created successfully',
            data: newProvider,
          };
        }
      } else {
        throw new BadRequestException('CreateOrUpdateHealthCareProviderDto is required.');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upsert HealthCareProvider: ' + error.message,
      );
    }
  }

  async findAll(sectionName: string) {
    try {
      const healthCareProviders = await this.prisma.healthCareProvider.findMany({
        where: { sectionName },
      });

      if (!healthCareProviders || healthCareProviders.length === 0) {
        throw new NotFoundException(`No HealthCareProviders found for section '${sectionName}'.`);
      }

      return healthCareProviders;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch HealthCareProviders: ' + error.message);
    }
  }
}