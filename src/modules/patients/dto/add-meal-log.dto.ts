import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class AddMealLogDto {
  @ApiProperty({ example: '2024-02-01T12:30:00Z' })
  @IsDateString()
  datetime!: string;

  @ApiProperty({ type: [String], example: ['Pao integral', 'Ovo cozido'] })
  @IsArray()
  items!: string[];

  @ApiPropertyOptional({ example: 450 })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional({
    example: {
      protein: 25,
      carbs: 50,
      fat: 15,
    },
  })
  @IsOptional()
  @IsObject()
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}
