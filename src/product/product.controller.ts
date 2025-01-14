// src/product/product.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe, 
  UseGuards 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    // Ensure sectionName is provided
    if (!createProductDto.sectionName) {
      throw new Error('sectionName is required');
    }
    return this.productService.create(createProductDto);
  }

  @Get(':pageName/:sectionName')
  findAll(
    @Param('pageName') pageName: 'allo' | 'car19', 
    @Param('sectionName') sectionName: string
  ) {
    return this.productService.findAll(pageName, sectionName);
  }

  @Put(':pageName/:sectionName/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('pageName') pageName: 'allo' | 'car19',
    @Param('sectionName') sectionName: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, pageName, sectionName, updateProductDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.productService.remove(id);
  }
}
