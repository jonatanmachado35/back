import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodsService } from './foods.service';

const foodExample = {
  id: 123,
  nome: 'Pao integral',
  marca: 'Padaria Central',
  categoria: 'Panificados',
  porcaoPadrao: '50 g',
  calorias: 120,
  proteinas: 4,
  carboidratos: 22,
  gordurasTotais: 2.5,
  gordurasSaturadas: 0.5,
  gordurasTrans: 0,
  fibras: 3,
  sodio: 180,
  acucar: 4,
  indiceGlicemico: 55,
  cargaGlicemica: 12,
  imagemUrl: 'https://cdn.exemplo.com/foods/123.png',
  fonte: 'tabela_taco',
  criadoPor: 7,
  publico: true,
  ativo: true,
  dataCriacao: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:00:00.000Z',
};

@ApiTags('Foods')
@Controller('alimentos')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @ApiCreatedResponse({ schema: { example: foodExample } })
  create(@Body() payload: CreateFoodDto) {
    return this.foodsService.create(payload);
  }

  @Get()
  @ApiOkResponse({ schema: { example: [foodExample] } })
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ schema: { example: foodExample } })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.findById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ schema: { example: foodExample } })
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateFoodDto) {
    return this.foodsService.update(id, payload);
  }
}
