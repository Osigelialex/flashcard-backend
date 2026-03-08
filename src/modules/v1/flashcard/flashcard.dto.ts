import { BloomLevel, CardType } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

export class GenerateFlashcardDto {
  @IsString()
  @IsNotEmpty()
  notes: string;
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
