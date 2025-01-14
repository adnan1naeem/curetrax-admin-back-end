import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async create(createHomeDto: CreateHomeDto, imageUrl: Express.Multer.File | null) {
        try {
              let profileImageUrl = '';
          
              let imageUploadStatus = 'Image upload failed';

              if (imageUrl) {
                  try {
                    // Assuming you have an S3 service that uploads the file
                    profileImageUrl = await this.s3Service.uploadFile(imageUrl, 'home');
                    imageUploadStatus = 'Image uploaded successfully'; 
                  } catch (uploadError) {
                    imageUploadStatus = 'Image upload failed: ' + uploadError.message; 
                  }
                }

              console.log(profileImageUrl,"----");
          
              const dataToSave = {
                sectionName: createHomeDto.sectionName, // Assuming sectionName is passed in createHomeDto
                heading: createHomeDto.heading || null,
                description: createHomeDto.description || null,
                image: profileImageUrl || null,
                button: createHomeDto.button || null,
                link: createHomeDto.link || null,
              };
          
              const createdHomeData = await this.prisma.home.create({
                data: dataToSave,
              });
          
              return {
                message: 'home data created successfully',
                data: createdHomeData,
                imageUploadStatus
              };
        } catch (error) {
                return {
                message: 'An error occurred while creating the team member.',
                error: error.message,
            };
        }
  }
          

  async getSections(sectionName: string) {
    const sections = await this.prisma.home.findMany({
      where: {
        sectionName: sectionName, // Filter by sectionName
      },
    });

    if (sections.length === 0) {
      throw new NotFoundException(`No data found for sectionName: ${sectionName}`);
    }

    return sections;
  }

  async updateSection(
    id: number,
    sectionName: string,
    updateHomeDto: UpdateHomeDto,
    image: Express.Multer.File,
  ) {
    const existingSection = await this.prisma.home.findUnique({
      where: {
        id: id,
        sectionName: sectionName,
      },
    });

    if (!existingSection) {
      throw new NotFoundException(`No section found for sectionName: ${sectionName} and id: ${id}`);
    }

    let profileImageUrl = existingSection.image; 
    let imageUploadStatus = 'Image upload failed';

    if (image) {
        try {
          // Assuming you have an S3 service that uploads the file
          profileImageUrl = await this.s3Service.uploadFile(image, 'home');
          imageUploadStatus = 'Image uploaded successfully'; // Update the status if upload is successful
        } catch (uploadError) {
          imageUploadStatus = 'Image upload failed: ' + uploadError.message; // Capture the error message
        }
      }

    const updatedHomeData = await this.prisma.home.update({
      where: { id: id },
      data: {
        ...updateHomeDto,
        image: profileImageUrl, 
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Section updated successfully',
      data: updatedHomeData,
      imageUploadStatus
    };
  }


  async findOne(id: number) {
    return this.prisma.home.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateHomeDto: UpdateHomeDto) {
    return this.prisma.home.update({
      where: { id },
      data: updateHomeDto,
    });
  }

  async remove(id: number, sectionName: string) {
    try {
      const existingSection = await this.prisma.home.findUnique({
        where: {
          id: id,
          sectionName: sectionName,
        },
      });

      if (!existingSection) {
        throw new NotFoundException(`No section found with id: ${id} and sectionName: ${sectionName}`);
      }

      const deletedSection = await this.prisma.home.delete({
        where: {
          id: id,
        },
      });

      return {
        message: 'Section deleted successfully',
        data: deletedSection,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete section: ' + error.message);
    }
  }
}
