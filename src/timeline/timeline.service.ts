import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // Adjust path accordingly
import { UpsertTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { S3Service } from '../s3/s3.service'; // Adjust path accordingly

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async upsert(upsertTimelineDto: UpsertTimelineDto,sectionName, image: Express.Multer.File | null) {
    try {
      let imageUrl = null;
      let imageUploadStatus = 'Image upload not attempted';

      // Handle image upload if provided
      if (image) {
        try {
          imageUrl = await this.s3Service.uploadFile(image, 'timeline');
          imageUploadStatus = 'Image uploaded successfully';
        } catch (uploadError) {
          imageUploadStatus = 'Image upload failed: ' + uploadError.message;
        }
      }

      const date = upsertTimelineDto.date ? new Date(upsertTimelineDto.date) : null;
      if (date && isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Please provide a valid ISO 8601 date string.');
      }

      let timeline;
      if (upsertTimelineDto.id) {
        const parsedId = parseInt(upsertTimelineDto.id, 10);
        if (isNaN(parsedId)) {
          throw new BadRequestException('Invalid ID format. Please provide a valid numeric ID.');
        }
        const existingTimeline = await this.prisma.timeline.findUnique({
          where: { id: parsedId },
        });

        if (existingTimeline) {
          // Update the timeline entry
          timeline = await this.prisma.timeline.update({
            where: { id: parsedId },
            data: {
              sectionName: sectionName,
              heading: upsertTimelineDto.heading,
              description: upsertTimelineDto.description,
              date: date || existingTimeline.date,
              image: imageUrl || existingTimeline.image,
            },
          });
        } else {
          throw new NotFoundException(
            `Timeline entry with id ${upsertTimelineDto.id} not found for update.`,
          );
        }
      } else {
        // Create a new timeline entry
        timeline = await this.prisma.timeline.create({
          data: {
            sectionName: sectionName,
            heading: upsertTimelineDto.heading,
            description: upsertTimelineDto.description,
            date: date,
            image: imageUrl || 'null',
          },
        });
      }

      return {
        message: 'Timeline entry upserted successfully',
        data: timeline,
        imageUploadStatus,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upsert timeline entry: ' + error.message);
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
