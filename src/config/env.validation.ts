import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

export enum NodeEnv {
  DEV = 'dev',
  PROD = 'prod',
}

class EnvVariable {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  // --- App ---
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;

  // --- Database ---
  @IsString()
  @IsNotEmpty()
  @IsUrl({
    protocols: ['postgresql', 'postgres'],
    require_tld: false,
    require_protocol: true,
  })
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  DB_CA_PATH?: string;

  // --- anthropic ---
  @IsString()
  @IsNotEmpty()
  ANTHROPIC_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariable, config, {
    enableImplicitConversion: true, // "3000" => 3000 자동변환
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0)
    throw new Error(
      `환경변수 검증 실패: \n${errors.map((e) => e.toString()).join('\n')}`,
    );
  return validatedConfig;
}
