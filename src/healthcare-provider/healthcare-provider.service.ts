import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // Update if you're using custom Prisma service
import { CreateHealthCareProviderDto } from './dto/create-healthcare-provider.dto';
import { UpdateHealthCareProviderDto } from './dto/update-healthcare-provider.dto';

@Injectable()
export class HealthCareProviderService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createHealthCareProviderDto: CreateHealthCareProviderDto) {
    try {
      const healthCareProvider = await this.prisma.healthCareProvider.create({
        data: createHealthCareProviderDto,
      });

      return {
        message: 'HealthCareProvider created successfully',
        data: healthCareProvider,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create HealthCareProvider: ' + error.message);
    }
  }

  async findAll(sectionName: string) {
    if (!sectionName) {
      throw new InternalServerErrorException('sectionName is required');
    }

    try {
      const healthCareProviders = await this.prisma.healthCareProvider.findMany({
        where: {
          sectionName: sectionName, // Filter by sectionName
        },
      });

      if (healthCareProviders.length === 0) {
        throw new NotFoundException(`No HealthCareProviders found for sectionName: ${sectionName}`);
      }

      return healthCareProviders;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch HealthCareProviders: ' + error.message);
    }
  }

  // Get a single HealthCareProvider by id and sectionName
  async findOne(id: number, sectionName: string) {
    try {
      const healthCareProvider = await this.prisma.healthCareProvider.findUnique({
        where: {
          id: id,
          sectionName: sectionName,
        },
      });

      if (!healthCareProvider) {
        throw new NotFoundException(
          `HealthCareProvider with id ${id} and sectionName '${sectionName}' not found`,
        );
      }

      return healthCareProvider;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch HealthCareProvider: ' + error.message);
    }
  }

  // Update an existing HealthCareProvider
  async update(id: number, sectionName: string, updateHealthCareProviderDto: UpdateHealthCareProviderDto) {
    try {
      const existingHealthCareProvider = await this.prisma.healthCareProvider.findUnique({
        where: {
          id: id,
          sectionName: sectionName,
        },
      });

      if (!existingHealthCareProvider) {
        throw new NotFoundException(
          `HealthCareProvider with id ${id} and sectionName '${sectionName}' not found`,
        );
      }

      const updatedHealthCareProvider = await this.prisma.healthCareProvider.update({
        where: {
          id: id,
          sectionName: sectionName,
        },
        data: updateHealthCareProviderDto,
      });

      return {
        message: 'HealthCareProvider updated successfully',
        data: updatedHealthCareProvider,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update HealthCareProvider: ' + error.message);
    }
  }

  // Delete a HealthCareProvider
  async remove(id: number, sectionName: string) {
    try {
      const existingHealthCareProvider = await this.prisma.healthCareProvider.findUnique({
        where: {
          id: id,
          sectionName: sectionName,
        },
      });

      if (!existingHealthCareProvider) {
        throw new NotFoundException(
          `HealthCareProvider with id ${id} and sectionName '${sectionName}' not found`,
        );
      }

      const deletedHealthCareProvider = await this.prisma.healthCareProvider.delete({
        where: {
          id: id,
          sectionName: sectionName,
        },
      });

      return {
        message: 'HealthCareProvider deleted successfully',
        data: deletedHealthCareProvider,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete HealthCareProvider: ' + error.message);
    }
  }
}
