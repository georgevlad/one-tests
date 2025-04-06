// src/bolt/dto/search-rides-request.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class SearchRidesRequestDto {
  // Device-related params
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  authHeader: string;

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
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  // Ride-specific params
  @IsNumber()
  @IsLatitude()
  originLat: number;

  @IsNumber()
  @IsLongitude()
  originLng: number;

  @IsNumber()
  @IsLatitude()
  destinationLat: number;

  @IsNumber()
  @IsLongitude()
  destinationLng: number;

  @IsString()
  @IsNotEmpty()
  paymentTokenId: string;
}