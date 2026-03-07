import { IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDTO {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  perPage: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;
}
