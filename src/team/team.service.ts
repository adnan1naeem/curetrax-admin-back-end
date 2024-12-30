import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { DatabaseService } from 'src/database/database.service';
import { S3Service } from 'src/s3/s3.service';
@Injectable()
export class TeamService {
    constructor(
        private prisma: DatabaseService,
        private readonly s3Service: S3Service,
      ) {}

    async createTeamMember(
        CreateTeamDto: CreateTeamDto,
        imageUrl: Express.Multer.File | null,
      ) {
        let profileImageUrl = '';
        
        if (imageUrl) {
            profileImageUrl = await this.s3Service.uploadFile(imageUrl,'teams');
        }        
        const createdTeamMember = await this.prisma.team.create({
          data: {
            name: CreateTeamDto.name,
            profession: CreateTeamDto.profession,
            linkedinUrl: CreateTeamDto.linkedinUrl,
            description: CreateTeamDto.description,
            imageUrl: profileImageUrl,
            googleScholar: CreateTeamDto.googleScholar,
            researchGate: CreateTeamDto.researchGate,
            
          },
        });
        return {
          message: 'Team Member created successfully',
          data: createdTeamMember,
        };
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

    async updateTeamMember(id: number, updateTeamDto: UpdateTeamDto, imageUrl: Express.Multer.File) {
        let profileImageUrl = '';

        try {
            if (imageUrl) {
                profileImageUrl = await this.s3Service.uploadFile(imageUrl, 'teams');
            }
            const existingTeamMember = await this.prisma.team.findUnique({
                where: { id },
            });

            if (!existingTeamMember) {
                throw new NotFoundException(`Team member with ID ${id} not found`);
            }

            const updateData: any = { ...updateTeamDto };

            if (profileImageUrl) {
                updateData.imageUrl = profileImageUrl;
            }

            const updatedTeamMember = await this.prisma.team.update({
                where: { id },
                data: updateData,
            });

            return {
                message: 'Team member updated successfully',
                data: updatedTeamMember,
            };

        } catch (error) {
            if (error instanceof Error && error.message.includes('uploadFile')) {
                throw new InternalServerErrorException('Error uploading file to S3');
            }

            throw new InternalServerErrorException(`An error occurred while updating the team member: ${error.message}`);
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
