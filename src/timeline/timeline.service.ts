import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // Adjust path accordingly
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { S3Service } from '../s3/s3.service'; // Adjust path accordingly

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  // Create a new Timeline entry
  async create(createTimelineDto: CreateTimelineDto, image: Express.Multer.File | null) {
    try {
      let imageUrl = null;
      let imageUploadStatus = 'Image upload failed';
      
      // Handle image upload if provided
      if (image) {
        try {
          imageUrl = await this.s3Service.uploadFile(image, 'home');
          imageUploadStatus = 'Image uploaded successfully'; 
        } catch (uploadError) {
          imageUploadStatus = 'Image upload failed: ' + uploadError.message; 
        }
      }
      
      console.log(createTimelineDto.date,"date");
      let date ;
      if(createTimelineDto.date){
         date = new Date(createTimelineDto.date);
      }
      
      
      
  
      const timeline = await this.prisma.timeline.create({
        data: {
          sectionName: createTimelineDto.sectionName,
          heading: createTimelineDto.heading,
          description: createTimelineDto.description,
          date: date || null,  // Store the Date object
          image: imageUrl || 'null',  // Store the image URL if uploaded, otherwise 'null'
        },
      });
  
      return {
        message: 'Timeline entry created successfully',
        data: timeline,
        imageUploadStatus,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create timeline entry: ' + error.message);
    }
  }

  // Get all timelines or a specific timeline by id
  async getSectionData(sectionName: string) {
    try {
      const timelines = await this.prisma.timeline.findMany({
        where: {
          sectionName,
        },
      });

      if (timelines.length === 0) {
        throw new Error(`No timelines found for sectionName: ${sectionName}`);
      }

      return {
        message: 'Timelines fetched successfully',
        data: timelines,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch timelines: ' + error.message);
    }
  }

  // Update a timeline entry
  async update(
    id: number,
    sectionName: string,
    updateTimelineDto: UpdateTimelineDto,
    image: Express.Multer.File | null
  ) {
    try {
      const existingTimeline = await this.prisma.timeline.findUnique({
        where: { id, sectionName },
      });
  
      if (!existingTimeline) {
        throw new NotFoundException(
          `Timeline entry with id ${id} and sectionName '${sectionName}' not found`
        );
      }
  
      let imageUrl = existingTimeline.image; 
      let imageUploadStatus = 'Image upload not attempted';
  
      if (image) {
        try {
          imageUrl = await this.s3Service.uploadFile(image, 'timeline');
          imageUploadStatus = 'Image uploaded successfully';
        } catch (uploadError) {
          imageUploadStatus = 'Image upload failed: ' + uploadError.message;
        }
      }
  
      const updateData: any = { ...updateTimelineDto, image: imageUrl };
  
      if (updateTimelineDto.date) {
        const date = new Date(updateTimelineDto.date);
        if (isNaN(date.getTime())) {
          throw new BadRequestException('Invalid date format. Please provide a valid ISO 8601 date string.');
        }
        updateData.date = date;
      }
  
      // Perform the update
      const updatedTimeline = await this.prisma.timeline.update({
        where: { id },
        data: updateData,
      });
  
      return {
        message: 'Timeline entry updated successfully',
        data: updatedTimeline,
        imageUploadStatus,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update timeline entry: ' + error.message);
    }
  }

  // Delete a timeline entry
  async remove(id: number, sectionName: string) {
    try {
      // Check if a section exists with the given id and sectionName
      const existingSection = await this.prisma.timeline.findUnique({
        where: {
          id: id,
          sectionName: sectionName,
        },
      });
  
      if (!existingSection) {
        throw new NotFoundException(`No section found with id: ${id} and sectionName: ${sectionName}`);
      }
  
      // Perform the deletion
      const deletedSection = await this.prisma.timeline.delete({
        where: {
          id: id,
          sectionName: sectionName,
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
