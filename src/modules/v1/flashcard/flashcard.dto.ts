import { PaginationDTO } from "@lib/core/dto";
import { BloomLevel, CardType } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

export class GenerateFlashcardDto {
  @IsString()
  @IsNotEmpty()
  notes: string;
}

export class UpdateFlashcardSetDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  topic: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  summary: string;
}

export class UpdateFlashCardDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  question: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  answer: string;

  @IsEnum(CardType)
  @IsNotEmpty()
  @IsOptional()
  type: CardType;

  @IsEnum(BloomLevel)
  @IsNotEmpty()
  @IsOptional()
  bloomLevel: BloomLevel;
}

export class QueryFlashCardDTO {
  @IsEnum(CardType)
  @IsNotEmpty()
  @IsOptional()
  type: CardType;

  @IsEnum(BloomLevel)
  @IsNotEmpty()
  @IsOptional()
  bloomLevel: BloomLevel;
}
