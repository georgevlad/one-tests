// src/bolt/dto/login-request.dto.ts
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class BoltLoginRequestDto {

  @IsString()
  @IsNotEmpty()
  password: string;

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
  @IsLatitude()
  @IsNotEmpty()
  gps_lat: string;

  @IsString()
  @IsLongitude()
  @IsNotEmpty()
  gps_lng: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  @IsString()
  @IsNotEmpty()
  android_hash_string: string;
}