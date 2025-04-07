import { Controller, Post, Get, Body } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { BoltLoginRequestDto } from './dto/login-request.dto';
import { BoltLoginResponseDto } from './dto/login-response.dto';
import { BoltConfirmLoginRequestDto } from './dto/confirm-login-request.dto';
import { PaymentDataRequestDto } from './dto/payment-data-request.dto';
import { GetFavoriteAddressDto } from './dto/get-favorite-address.dto';
import { SearchRidesRequestDto } from './dto/search-rides-request.dto';

@Controller('bolt')
export class BoltController {
  constructor(private readonly boltService: BoltService) {}

  @Post('login')
  async login(@Body() loginData: BoltLoginRequestDto): Promise<BoltLoginResponseDto> {
    return this.boltService.login(loginData);
  }

  @Post('confirm')
  async confirmLogin(@Body() confirmData: BoltConfirmLoginRequestDto) {
    return this.boltService.confirmLogin(confirmData);
  }

  @Post('payment-data')
  async getPaymentData(@Body() paymentDataRequest: PaymentDataRequestDto) {
    return this.boltService.getPaymentInstrumentData(paymentDataRequest);
  }

  @Post('favorite-addresses')
  async getFavoriteAddresses(@Body() addressRequestDto: GetFavoriteAddressDto) {
    return this.boltService.getFavoriteAddresses(addressRequestDto);
  }

  @Post('search-rides')
  async searchRides(@Body() searchRidesRequestDto: SearchRidesRequestDto) {
    return this.boltService.searchRideOptions(searchRidesRequestDto);
  }
}