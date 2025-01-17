import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateHomeDto } from './dto/home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import {S3Service} from '../s3/s3.service';

@Injectable()
export class HomeService {
  constructor(
    private prisma: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async upsert(
    id: string | null,
    sectionName: string,
    createHomeDto: CreateHomeDto,
    imageUrl: Express.Multer.File | null
  ) {
    try {
      let profileImageUrl = '';
      let imageUploadStatus = 'Image upload failed';
  
      // Handle image upload if provided
      if (imageUrl) {
        try {
          profileImageUrl = await this.s3Service.uploadFile(imageUrl, 'home');
          imageUploadStatus = 'Image uploaded successfully';
        } catch (uploadError) {
          imageUploadStatus = 'Image upload failed: ' + uploadError.message;
        }
      }
  
      // Initialize the data object with fields to update or create
      const dataToSave: any = {};
      if (sectionName) dataToSave.sectionName = sectionName;
      if (createHomeDto.heading) dataToSave.heading = createHomeDto.heading;
      if (createHomeDto.description) dataToSave.description = createHomeDto.description;
      if (profileImageUrl) dataToSave.image = profileImageUrl;
      if (createHomeDto.button) dataToSave.button = createHomeDto.button;
      if (createHomeDto.link) dataToSave.link = createHomeDto.link;
  
      if (id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
          throw new BadRequestException('Invalid ID format. Please provide a numeric ID.');
        }
  
        // Check if the record exists
        const existingSection = await this.prisma.home.findUnique({
          where: { id: parsedId },
        });
  
        if (existingSection) {
          // Update the existing section
          const updatedHomeData = await this.prisma.home.update({
            where: { id: parsedId },
            data: { ...dataToSave, updatedAt: new Date() },
          });
  
          return {
            message: 'Section updated successfully',
            data: updatedHomeData,
            imageUploadStatus,
          };
        } else {
          throw new NotFoundException(`Section with ID ${id} not found.`);
        }
      } else {
        // Create a new section if ID is not provided
        const createdHomeData = await this.prisma.home.create({
          data: dataToSave,
        });
  
        return {
          message: 'Section created successfully',
          data: createdHomeData,
          imageUploadStatus,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException('Error in upsert operation: ' + error.message);
    }
  }
  

  async getAll(sectionName: string) {
    try {
      const sections = await this.prisma.home.findMany({
        where: { sectionName },
      });

      if (sections.length === 0) {
        throw new NotFoundException(`No data found for sectionName: ${sectionName}`);
      }

      return sections;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch sections: ' + error.message);
    }
  }
}
