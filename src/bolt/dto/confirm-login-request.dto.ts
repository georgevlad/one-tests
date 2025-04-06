// src/bolt/dto/confirm-login-request.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class BoltConfirmLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  code: string;
  
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  device_name: string;

  @IsString()
  @IsNotEmpty()
  device_os_version: string;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  gps_lat: string;

  @IsString()
  @IsNotEmpty()
  gps_lng: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;
}