import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async deleteRecord<T extends keyof PrismaClient>(modelName: T, id: string) {
    if (!id) {
      throw new NotFoundException('ID must be provided.');
    }

    const modelDelegate = this[modelName] as any; // Use 'any' for dynamic model access

    if (!modelDelegate?.delete || typeof modelDelegate.delete !== 'function') {
      throw new NotFoundException(
        `Model '${String(modelName)}' does not support the required operations.`,
      );
    }
    const intId = parseInt(id, 10); // Convert the string to an integer
    if (isNaN(intId)) {
      throw new BadRequestException('Invalid ID');
    }

    const record = await modelDelegate.findUnique({
      where: { id : intId },
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found.`);
    }

    await modelDelegate.delete({
      where: { id : intId},
    });
    return { message: `Record with ID ${id} has been successfully deleted.` };
  }
}
