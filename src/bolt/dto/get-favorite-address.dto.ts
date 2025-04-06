// src/bolt/dto/get-favorite-address.dto.ts
import { IsString, IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';

export class GetFavoriteAddressDto {
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
  timezone: string;
}