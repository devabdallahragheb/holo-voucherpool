import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';
import Environment from 'src/common/enums/environment.type';
// this file more importent for deplyment 

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  POSTGRES_DB: string;

  @IsNumberString()
  POSTGRES_PORT: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_HOST: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
