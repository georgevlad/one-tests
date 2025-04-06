import { Controller, Post, Body } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { BoltLoginRequestDto } from './dto/login-request.dto';
import { BoltLoginResponseDto } from './dto/login-response.dto';
import { BoltConfirmLoginRequestDto } from './dto/confirm-login-request.dto';

@Controller('bolt')
export class BoltController {
  constructor(private readonly boltService: BoltService) {}

  @Post('login')
  async login(@Body() loginData: BoltLoginRequestDto): Promise<BoltLoginResponseDto> {
    return this.boltService.login(loginData);
  }

  @Post('confirm')
  async confirmLogin(@Body() confirmData: BoltConfirmLoginRequestDto) {
    return this.boltService.confirmLogin(
      confirmData.phone_number,
      confirmData.password,
      confirmData.code,
      {
        version: confirmData.version,
        deviceId: confirmData.deviceId,
        device_name: confirmData.device_name,
        device_os_version: confirmData.device_os_version,
        channel: confirmData.channel,
        brand: confirmData.brand,
        deviceType: confirmData.deviceType,
        country: confirmData.country,
        gps_lat: confirmData.gps_lat,
        gps_lng: confirmData.gps_lng,
        userAgent: confirmData.userAgent,
        timezone: confirmData.timezone,
        // We won't need these for the confirm endpoint
        phone_number: confirmData.phone_number,
        password: confirmData.password,
        email: '', // This field isn't needed for confirm
        android_hash_string: ''  // This field isn't needed for confirm
      } as BoltLoginRequestDto
    );
  }
}