import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpsertProductDto } from './dto/create-product.dto';


export enum PageName {
  ALLO = 'allo',
  CAR19 = 'car19',
}
@Injectable()
export class ProductService {
  constructor(private prisma: DatabaseService) {}

  // Upsert: Create or Update a product
  async upsert(sectionName: string, createProductDto: UpsertProductDto) {
    try {
      if (createProductDto.id) {
        // If id is provided, update the existing product
        const existingProduct = await this.prisma.product.findUnique({
          where: { id: createProductDto.id ,sectionName : sectionName},
        });
  
        if (!existingProduct) {
          throw new NotFoundException(`Product with id ${createProductDto.id} not found`);
        }
  
        const updatedProduct = await this.prisma.product.update({
          where: { id: createProductDto.id },
          data: createProductDto,
        });
  
        return {
          message: 'Product updated successfully',
          data: updatedProduct,
        };
      } else {
          // If no product is found, create a new product
          
          const newProduct = await this.prisma.product.create({
            data: {
              ...createProductDto,
              sectionName: sectionName,
            },
          });
  
          return {
            message: 'Product created successfully',
            data: newProduct,
          };
        }
      } catch (error) {
      throw new InternalServerErrorException('Failed to upsert product: ' + error.message);
      }
    }

  // Get all products by pageName and sectionName
  async getAll(pageName: string, sectionName: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: { 
          pagename: pageName as PageName, 
          sectionName 
        },
      });

      if (products.length === 0) {
        throw new NotFoundException(
          `No products found for pageName: ${pageName} and sectionName: ${sectionName}`,
        );
      }

      return {
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products: ' + error.message);
    }
  }
}
