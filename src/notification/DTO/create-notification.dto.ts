import {
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateNotificationDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  actorId: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  notifierId: number;

  @IsDefined()
  @IsString()
  @MinLength(1)
  type: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  title: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  content: string;

  @IsDefined()
  createDate: Date;

  updateDate: Date;
}
