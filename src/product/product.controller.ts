import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpsertProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Upsert API: Create or Update a product
  @Post('upsert')
  // @UseGuards(JwtAuthGuard)
  async upsert(
    @Query('sectionName') sectionName: string,
    @Body() createProductDto: UpsertProductDto,
  ) {
    if (!sectionName || !createProductDto.pagename) {
      throw new Error('sectionName and pagename are required');
    }
    return this.productService.upsert(sectionName, createProductDto);
  }

  // Get all products by pageName and sectionName
  @Get('all')
  async getAll(
    @Query('pageName') pageName: 'allo' | 'car19', 
    @Query('sectionName') sectionName: string,
  ) {
    if (!pageName || !sectionName) {
      throw new Error('pageName and sectionName are required');
    }
    return this.productService.getAll(pageName, sectionName);
  }
}
