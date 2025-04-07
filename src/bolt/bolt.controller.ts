import { Controller, Post, Get, Body } from '@nestjs/common';
import { BoltService } from './bolt.service';
import { BoltLoginRequestDto } from './dto/login-request.dto';
import { BoltConfirmLoginRequestDto } from './dto/confirm-login-request.dto';
import { PaymentDataRequestDto } from './dto/payment-data-request.dto';
import { GetFavoriteAddressDto } from './dto/get-favorite-address.dto';
import { SearchRidesRequestDto } from './dto/search-rides-request.dto';
import { 
  ApiResponseDto,
  BoltLoginResponseDto, 
  BoltLoginDataDto,
  BoltConfirmLoginResponseDto,
  BoltConfirmLoginDataDto,
  PaymentDataResponseDto,
  FavoriteAddressResponseDto,
  SearchRidesResponseDto
} from './dto/api-response.dto';

@Controller('bolt')
export class BoltController {
  constructor(private readonly boltService: BoltService) {}

  @Post('login')
  async login(@Body() loginData: BoltLoginRequestDto): Promise<BoltLoginResponseDto> {
    const response = await this.boltService.login(loginData);
    
    const loginResponse = new BoltLoginResponseDto();
    
    if (response.success) {
      const loginData = new BoltLoginDataDto();
      loginData.resend_confirmation_interval_ms = response.data?.login_state?.resend_confirmation_interval_ms || 20000;
      
      loginResponse.success = true;
      loginResponse.message = "Login verification code sent successfully";
      loginResponse.data = loginData;
    } else {
      loginResponse.success = false;
      loginResponse.message = response.message || "Login failed";
      loginResponse.error = response.details || "An error occurred during login";
    }
    
    return loginResponse;
  }

  @Post('confirm')
  async confirmLogin(@Body() confirmData: BoltConfirmLoginRequestDto): Promise<BoltConfirmLoginResponseDto> {
    const response = await this.boltService.confirmLogin(confirmData);
    
    const confirmResponse = new BoltConfirmLoginResponseDto();
    
    if (response.success) {
      const confirmData = new BoltConfirmLoginDataDto();
      confirmData.userId = response.user_id;
      confirmData.token = response.auth_token;
      confirmData.authorization_header = response.authorization_header;
      confirmData.first_name = response.first_name;
      confirmData.last_name = response.last_name;
      confirmData.email = response.email;
      
      confirmResponse.success = true;
      confirmResponse.message = "Login confirmed successfully";
      confirmResponse.data = confirmData;
    } else {
      confirmResponse.success = false;
      confirmResponse.message = response.message || "Login confirmation failed";
      confirmResponse.error = response.details || "An error occurred during login confirmation";
    }
    
    return confirmResponse;
  }

  @Post('payment-data')
  async getPaymentData(@Body() paymentDataRequest: PaymentDataRequestDto): Promise<PaymentDataResponseDto> {
    const response = await this.boltService.getPaymentInstrumentData(paymentDataRequest);
    
    const paymentResponse = new PaymentDataResponseDto();
    
    if (response.success && response.data?.data?.payment_instruments?.length > 0) {
      let paymentInstrumentId = response.data.data.payment_instruments[0].id;
      
      // Remove the "processout/" prefix if it exists
      if (paymentInstrumentId.startsWith('processout/')) {
        paymentInstrumentId = paymentInstrumentId.replace('processout/', '');
      }
      
      paymentResponse.success = true;
      paymentResponse.message = "Payment data retrieved successfully";
      paymentResponse.data = {
        paymentInstrumentId: paymentInstrumentId
      };
    } else if (response.success) {
      // If successful but no payment instruments found
      paymentResponse.success = true;
      paymentResponse.message = "No payment instruments found";
      paymentResponse.data = {
        paymentInstrumentId: null
      };
    } else {
      paymentResponse.success = false;
      paymentResponse.message = response.message || "Failed to retrieve payment data";
      paymentResponse.error = response.details || "An error occurred while fetching payment data";
    }
    
    return paymentResponse;
  }

  // Test endpoint to check Bolt API status and get favorite addresses
  @Post('check-connection-status')
  async getFavoriteAddresses(@Body() addressRequestDto: GetFavoriteAddressDto): Promise<FavoriteAddressResponseDto> {
    const response = await this.boltService.getFavoriteAddresses(addressRequestDto);
    
    const addressResponse = new FavoriteAddressResponseDto();
    
    if (response.success && response.data?.message === "OK") {
      addressResponse.success = true;
      addressResponse.message = "Bolt API is reachable";
      addressResponse.data = response.data;
    } else {
      addressResponse.success = false;
      addressResponse.message = response.message || "Failed to connect to Bolt API";
      addressResponse.error = response.details || "An error occurred while connecting to Bolt API";
    }
    
    return addressResponse;
  }

  @Post('search-rides')
  async searchRides(@Body() searchRidesRequestDto: SearchRidesRequestDto): Promise<SearchRidesResponseDto> {
    const response = await this.boltService.searchRideOptions(searchRidesRequestDto);
    
    const searchResponse = new SearchRidesResponseDto();
    
    if (response.success) {
      searchResponse.success = true;
      searchResponse.message = "Ride options retrieved successfully";
      searchResponse.data = response.data;
    } else {
      searchResponse.success = false;
      searchResponse.message = response.message || "Failed to retrieve ride options";
      searchResponse.error = response.details || "An error occurred while searching for ride options";
    }
    
    return searchResponse;
  }
}