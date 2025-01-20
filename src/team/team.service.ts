import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpsertTeamDto } from './dto/team.dto';
import { DatabaseService } from 'src/database/database.service';
import { S3Service } from 'src/s3/s3.service';
@Injectable()
export class TeamService {
    constructor(
        private prisma: DatabaseService,
        private readonly s3Service: S3Service,
      ) {}

      async upsertTeamMember(upsertTeamDto: UpsertTeamDto, image: Express.Multer.File | null) {
        try {
          let profileImageUrl = null;
          let imageUploadStatus = 'Image upload not attempted';
    
          // Handle image upload if provided
          if (image) {
            try {
              profileImageUrl = await this.s3Service.uploadFile(image, 'teams');
              imageUploadStatus = 'Image uploaded successfully';
            } catch (uploadError) {
              imageUploadStatus = 'Image upload failed: ' + uploadError.message;
            }
          }
    
          let teamMember;
          if (upsertTeamDto.id) {
            const parsedId = parseInt(upsertTeamDto.id, 10);
            if (isNaN(parsedId)) {
              throw new BadRequestException('Invalid ID format. Please provide a valid numeric ID.');
            }
            // Check if the team member exists
            const existingTeamMember = await this.prisma.team.findUnique({
              where: { id: parsedId },
            });
    
            if (existingTeamMember) {
              // Update the team member
              teamMember = await this.prisma.team.update({
                where: { id: parsedId },
                data: {
                  name: upsertTeamDto.name || existingTeamMember.name,
                  profession: upsertTeamDto.profession || existingTeamMember.profession,
                  linkedinUrl: upsertTeamDto.linkedinUrl || existingTeamMember.linkedinUrl,
                  description: upsertTeamDto.description || existingTeamMember.description,
                  googleScholar: upsertTeamDto.googleScholar || existingTeamMember.googleScholar,
                  researchGate: upsertTeamDto.researchGate || existingTeamMember.researchGate,
                  imageUrl: profileImageUrl || existingTeamMember.imageUrl,
                },
              });
            } else {
              throw new NotFoundException(`Team member with ID ${upsertTeamDto.id} not found for update.`);
            }
          } else {
            // Create a new team member
            teamMember = await this.prisma.team.create({
              data: {
                name: upsertTeamDto.name || 'null',
                profession: upsertTeamDto.profession || 'null',
                linkedinUrl: upsertTeamDto.linkedinUrl || 'null',
                description: upsertTeamDto.description || 'null',
                googleScholar: upsertTeamDto.googleScholar || 'null',
                researchGate: upsertTeamDto.researchGate || 'null',
                imageUrl: profileImageUrl || 'null',
              },
            });
          }
    
          return {
            message: 'Team member upserted successfully',
            data: teamMember,
            imageUploadStatus,
          };
        } catch (error) {
          throw new InternalServerErrorException('Failed to upsert team member: ' + error.message);
        }
      }

    async getAllTeamMembers() {
        try {
          const teamMembers = await this.prisma.team.findMany();
          if (!teamMembers || teamMembers.length === 0) {
            throw new NotFoundException('No team members found');
          }
          return {
            message: 'Team members retrieved successfully',
            data: teamMembers,
          };
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error;
          }
          throw new InternalServerErrorException(
            `An error occurred while retrieving team members: ${error.message}`,
          );
        }
    }

    async getTeamMemberById(id: number) {
        try {
          const teamMember = await this.prisma.team.findUnique({
            where: { id },
          });
    
          if (!teamMember) {
            throw new NotFoundException(`Team Member with ID ${id} not found`);
          }
    
          return {
            message: 'Team member retrieved successfully',
            data: teamMember,
          };
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error; // Re-throw NotFoundException to preserve status code
          }
          throw new InternalServerErrorException(
            `An error occurred while retrieving the team member: ${error.message}`,
          );
        }
    }

    async deleteTeamMember(id: number) {
        try {
          const existingTeamMember = await this.prisma.team.findUnique({
            where: { id },
          });
          
          if (!existingTeamMember) {
            throw new NotFoundException(`Team member with ID ${id} not found`);
          }
              await this.prisma.team.delete({
            where: { id },
          });
    
          return {
            message: 'Team member deleted successfully',
          };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; 
            }
            throw new InternalServerErrorException(
            `An error occurred while deleting the team member: ${error.message}`,
            );
        }
      }

    
}
