// src/product/product.service.ts
import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export enum PageName {
  ALLO = 'allo',
  CAR19 = 'car19',
}

@Injectable()
export class ProductService {
  constructor(private prisma: DatabaseService) {}

  // Create a new product
  async create(createProductDto: CreateProductDto) {
    try {
      if (!['allo', 'car19'].includes(createProductDto.pagename)) {
        throw new Error('Invalid pageName. Allowed values are: allo, car19');
      }

      const product = await this.prisma.product.create({
        data: createProductDto,
      });
      return {
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product: ' + error.message);
    }
  }

  async findAll(pageName: string, sectionName: string) {
    try {
      if (!Object.values(PageName).includes(pageName as PageName)) {
        throw new Error(`Invalid pageName. Allowed values are: ${Object.values(PageName).join(', ')}`);
      }

      const products = await this.prisma.product.findMany({
        where: {
          pagename: pageName as PageName, 
          sectionName: sectionName,
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

  // Update a product by id, pageName, and sectionName
  async update(id: number, pageName: string, sectionName: string, updateProductDto: UpdateProductDto) {
    try {
      if (!['allo', 'car19'].includes(pageName)) {
        throw new Error('Invalid pageName. Allowed values are: allo, car19');
      }

      const existingProduct = await this.prisma.product.findFirst({
        where: { id, pagename: pageName as PageName, sectionName },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${id}, pageName ${pageName}, and sectionName ${sectionName} not found`);
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product: ' + error.message);
    }
  }

  
  async remove(id: number) {
    try {
      

      const existingProduct = await this.prisma.product.findUnique({
        where: { id},
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      return {
        message: 'Product deleted successfully',
        data: deletedProduct,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product: ' + error.message);
    }
  }
}
