import { IsString, IsNotEmpty } from "class-validator";

export class GenerateFlashcardDto {
  @IsString()
  @IsNotEmpty()
  notes: string;
}
