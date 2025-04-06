import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BoltLoginRequestDto } from './dto/login-request.dto';
import { BoltLoginResponseDto } from './dto/login-response.dto';
import { BoltConfirmLoginRequestDto } from './dto/confirm-login-request.dto';
import { PaymentDataRequestDto } from './dto/payment-data-request.dto';
import { AxiosResponse } from 'axios';
import { GetFavoriteAddressDto } from './dto/get-favorite-address.dto';
import { SearchRidesRequestDto } from './dto/search-rides-request.dto';

@Injectable()
export class BoltService {
  private readonly baseUrl = 'https://user.live.boltsvc.net/profile/verification';

  constructor(private readonly httpService: HttpService) {}

  async login(loginData: BoltLoginRequestDto): Promise<any> {
    const url = `${this.baseUrl}/start/v2`;

    // Construct query parameters from the login data
    const queryParams = {
      version: loginData.version,
      deviceId: loginData.deviceId,
      device_name: loginData.device_name,
      device_os_version: loginData.device_os_version,
      channel: loginData.channel,
      brand: loginData.brand,
      deviceType: loginData.deviceType,
      signup_session_id: '', // HARDCODED
      country: loginData.country,
      is_local_authentication_available: 'false', // HARDCODED
      language: 'en', // HARDCODED
      gps_lat: loginData.gps_lat,
      gps_lng: loginData.gps_lng,
      gps_accuracy_m: '10.0', // HARDCODED
      gps_age: '32', // HARDCODED
      session_id: `${loginData.deviceId}u${Date.now()}`, // BACKEND GENERATED
      distinct_id: `%24device%3A${this.generateUUID()}`, // BACKEND GENERATED
      rh_session_id: `${loginData.deviceId}u${Math.floor(Date.now() / 1000)}`, // BACKEND GENERATED
    };

    // Construct headers
    const headers = {
      'Accept-Encoding': 'gzip',
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${loginData.version}%2B3240,sentry-trace_id=${this.generateTraceId()}`,
      'Connection': 'Keep-Alive',
      'Content-Type': 'application/json; charset=UTF-8',
      'Host': 'user.live.boltsvc.net',
      'sentry-trace': `${this.generateTraceId()}-${this.generateSpanId()}`,
      'User-Agent': loginData.userAgent,
    };

    // Construct request body
    const body = {
      type: 'phone', // HARDCODED
      phone_number: loginData.phone_number,
      password: loginData.password,
      last_known_state: {
        opened_product: {
          product: 'taxi', // HARDCODED
        },
      },
      timezone: loginData.timezone,
      app_store_verification_result: { // HARDCODED
        integrity_token: '',
        version_code: '3240',
        type: 'google',
      },
      method: 'sms', // HARDCODED
      android_hash_string: loginData.android_hash_string,
      alternative_channel: 'sms', // HARDCODED
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers,
          params: queryParams,
        }),
      );
      
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('Error during login:', error);
      
      // Return a formatted error response
      return {
        success: false,
        message: 'Login request failed',
        details: error.message || 'An unexpected error occurred',
        code: error.response?.status || 500,
        errorData: error.response?.data || null
      };
    }
  }

  async confirmLogin(phoneNumber: string, password: string, code: string, loginData: BoltLoginRequestDto) {
    const url = `${this.baseUrl}/confirm/v3`;

    // Construct query parameters
    const queryParams = {
      version: loginData.version,
      deviceId: loginData.deviceId,
      device_name: loginData.device_name,
      device_os_version: loginData.device_os_version,
      channel: loginData.channel,
      brand: loginData.brand,
      deviceType: loginData.deviceType,
      signup_session_id: '', // HARDCODED
      country: loginData.country,
      is_local_authentication_available: 'false', // HARDCODED
      language: 'en', // HARDCODED
      gps_lat: loginData.gps_lat,
      gps_lng: loginData.gps_lng,
      gps_accuracy_m: '10.0', // HARDCODED
      gps_age: '114', // HARDCODED, different from login
      session_id: `${loginData.deviceId}u${Date.now()}`, // BACKEND GENERATED
      distinct_id: `%24device%3A${this.generateUUID()}`, // BACKEND GENERATED
      rh_session_id: `${loginData.deviceId}u${Math.floor(Date.now() / 1000)}`, // BACKEND GENERATED
    };

    // Construct headers
    const headers = {
      'Accept-Encoding': 'gzip',
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${loginData.version}%2B3240,sentry-trace_id=${this.generateTraceId()}`,
      'Connection': 'Keep-Alive',
      'Content-Type': 'application/json; charset=UTF-8',
      'Host': 'user.live.boltsvc.net',
      'sentry-trace': `${this.generateTraceId()}-${this.generateSpanId()}`,
      'User-Agent': loginData.userAgent,
    };

    // Construct request body
    const body = {
      type: 'phone', // HARDCODED
      phone_number: phoneNumber,
      password: password,
      code: code,
      timezone: loginData.timezone,
      last_known_state: {
        opened_product: {
          product: 'taxi', // HARDCODED
        },
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers,
          params: queryParams,
        }),
      );
      
      // Check if we have a valid auth object in the response
      if (response.data?.data?.auth) {
        // Extract the auth object from the response
        const auth = response.data.data.auth;
        
        // Generate the authorization header
        const authorizationHeader = this.getAuthorizationHeader(auth.auth_username, password);
        
        // Return the auth object with the added authorization header
        return {
          success: true,
          ...auth,
          authorization_header: authorizationHeader
        };
      } else {
        // If the auth object is missing, return a formatted error response
        return {
          success: false,
          message: 'Authentication failed',
          details: response.data?.message || 'Invalid verification code or credentials',
          code: response.data?.code || 'UNKNOWN_ERROR'
        };
      }
    } catch (error) {
      console.error('Error during login confirmation:', error);
      
      // Return a formatted error response
      return {
        success: false,
        message: 'Authentication request failed',
        details: error.message || 'An unexpected error occurred',
        code: error.response?.status || 500,
        errorData: error.response?.data || null
      };
    }
  }

  async getPaymentInstrumentData(paymentDataRequest: PaymentDataRequestDto) {
    const url = `https://user.live.boltsvc.net/payment/instrument/listWithBalanceData`;
    
    // Parse lat and lng as numbers
    const lat = parseFloat(paymentDataRequest.gps_lat);
    const lng = parseFloat(paymentDataRequest.gps_lng);
    
    // Construct query parameters from the request data
    const queryParams = {
      version: paymentDataRequest.version,
      deviceId: paymentDataRequest.deviceId,
      device_name: paymentDataRequest.device_name,
      device_os_version: paymentDataRequest.device_os_version,
      channel: paymentDataRequest.channel,
      brand: paymentDataRequest.brand,
      deviceType: paymentDataRequest.deviceType,
      signup_session_id: '', // HARDCODED
      country: paymentDataRequest.country,
      is_local_authentication_available: 'false', // HARDCODED
      language: 'en', // HARDCODED
      gps_lat: paymentDataRequest.gps_lat,
      gps_lng: paymentDataRequest.gps_lng,
      gps_accuracy_m: '10.0', // HARDCODED
      gps_age: '0', // HARDCODED
      user_id: paymentDataRequest.userId,
      session_id: `${paymentDataRequest.userId}u${Date.now()}`, // BACKEND GENERATED
      distinct_id: `client-${paymentDataRequest.userId}`, // BACKEND GENERATED
      rh_session_id: `${paymentDataRequest.userId}u${Math.floor(Date.now() / 1000)}`, // BACKEND GENERATED
    };
    
    // Headers
    const headers = {
      'Accept-Encoding': 'gzip',
      'Authorization': paymentDataRequest.authHeader,
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${paymentDataRequest.version}%2B3240,sentry-trace_id=${this.generateTraceId()}`,
      'Connection': 'Keep-Alive',
      'Host': 'user.live.boltsvc.net',
      'User-Agent': paymentDataRequest.userAgent,
    };
    
    // Body (with extra params)
    const body = {
      lat,
      lng,
      flow: 'all',
      status_filter: ['active', 'pending', 'expired', 'unavailable'],
      external_payment_methods: [],
    };
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers,
          params: queryParams,
        }),
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment instrument data:', error);
      
      return {
        success: false,
        message: 'Failed to fetch payment instrument data',
        details: error.message || 'An unexpected error occurred',
        code: error.response?.status || 500,
        errorData: error.response?.data || null
      };
    }
  }

  async getFavoriteAddresses(addressRequestDto: GetFavoriteAddressDto) {
    const url = `https://user.live.boltsvc.net/profile/favoriteAddress/list`;
    
    // Construct query parameters from the request data
    const queryParams = {
      include_custom_addresses: 'true', // HARDCODED
      version: addressRequestDto.version,
      deviceId: addressRequestDto.deviceId,
      device_name: addressRequestDto.device_name,
      device_os_version: addressRequestDto.device_os_version,
      channel: addressRequestDto.channel,
      brand: addressRequestDto.brand,
      deviceType: addressRequestDto.deviceType,
      signup_session_id: '', // HARDCODED
      country: addressRequestDto.country,
      is_local_authentication_available: 'false', // HARDCODED
      language: 'en', // HARDCODED
      gps_lat: addressRequestDto.gps_lat,
      gps_lng: addressRequestDto.gps_lng,
      gps_accuracy_m: '10.0', // HARDCODED
      gps_age: '114', // HARDCODED
      user_id: addressRequestDto.userId,
      session_id: `${addressRequestDto.deviceId}u${Date.now()}`, // BACKEND GENERATED
      distinct_id: `%24device%3A${this.generateUUID()}`, // BACKEND GENERATED
      rh_session_id: `${addressRequestDto.deviceId}u${Math.floor(Date.now() / 1000)}`, // BACKEND GENERATED
    };
    
    // Headers
    const headers = {
      'Accept-Encoding': 'gzip',
      'Authorization': addressRequestDto.authHeader,
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${addressRequestDto.version}%2B3240,sentry-trace_id=${this.generateTraceId()}`,
      'Connection': 'Keep-Alive',
      'Host': 'user.live.boltsvc.net',
      'sentry-trace': `${this.generateTraceId()}-${this.generateSpanId()}`,
      'User-Agent': addressRequestDto.userAgent,
    };
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers,
          params: queryParams,
        }),
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching favorite addresses:', error);
      
      return {
        success: false,
        message: 'Failed to fetch favorite addresses',
        details: error.message || 'An unexpected error occurred',
        code: error.response?.status || 500,
        errorData: error.response?.data || null
      };
    }
  }
  
  async searchRideOptions(searchRidesRequestDto: SearchRidesRequestDto) {
    const url = `https://user.live.boltsvc.net/rides/search/getRideOptions`;
  
    // Query parameters
    const queryParams = {
      version: searchRidesRequestDto.version,
      deviceId: searchRidesRequestDto.deviceId,
      device_name: searchRidesRequestDto.device_name,
      device_os_version: searchRidesRequestDto.device_os_version,
      channel: searchRidesRequestDto.channel,
      brand: searchRidesRequestDto.brand,
      deviceType: searchRidesRequestDto.deviceType,
      signup_session_id: '', // HARDCODED
      country: searchRidesRequestDto.country,
      is_local_authentication_available: 'false', // HARDCODED
      language: 'en', // HARDCODED
      gps_lat: searchRidesRequestDto.originLat.toString(),
      gps_lng: searchRidesRequestDto.originLng.toString(),
      gps_accuracy_m: '10.0', // HARDCODED
      gps_age: '0', // HARDCODED
      user_id: searchRidesRequestDto.userId,
      session_id: `${searchRidesRequestDto.userId}u${Date.now()}`, // BACKEND GENERATED
      distinct_id: `client-${searchRidesRequestDto.userId}`, // BACKEND GENERATED
      rh_session_id: `${searchRidesRequestDto.userId}u${Math.floor(Date.now() / 1000)}`, // BACKEND GENERATED
    };
  
    // Headers
    const headers = {
      'Accept-Encoding': 'gzip',
      'Authorization': searchRidesRequestDto.authHeader,
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${searchRidesRequestDto.version}%2B3240,sentry-trace_id=${this.generateTraceId()}`,
      'Connection': 'Keep-Alive',
      'Content-Type': 'application/json; charset=UTF-8',
      'Host': 'user.live.boltsvc.net',
      'sentry-trace': `${this.generateTraceId()}-${this.generateSpanId()}`,
      'User-Agent': searchRidesRequestDto.userAgent,
    };
  
    // Body
    const body = {
      campaign_code: {}, // HARDCODED
      destination_stops: [
        {
          lat: searchRidesRequestDto.destinationLat,
          lng: searchRidesRequestDto.destinationLng,
        },
      ],
      payment_method: {
        id: searchRidesRequestDto.paymentTokenId,
        type: 'processout', // HARDCODED
      },
      pickup_stop: {
        is_confirmed: true, // HARDCODED
        lat: searchRidesRequestDto.originLat,
        lng: searchRidesRequestDto.originLng,
      },
      timezone: searchRidesRequestDto.timezone,
    };
  
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers,
          params: queryParams,
        }),
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error searching ride options:', error);
      
      return {
        success: false,
        message: 'Failed to search ride options',
        details: error.message || 'An unexpected error occurred',
        code: error.response?.status || 500,
        errorData: error.response?.data || null
      };
    }
  }

  // Generate the authorization header
  private getAuthorizationHeader(username: string, password: string): string {
    // Combine the username and password with a colon
    const userPass = `${username}:${password}`;
    
    // Encode the username:password string to Base64
    const encoded = Buffer.from(userPass).toString('base64');
    
    // Construct the Authorization header value
    return `Basic ${encoded}`;
  }

  // Helper functions for backend-generated values
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateTraceId(): string {
    return Array.from({length: 32}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private generateSpanId(): string {
    return Array.from({length: 16}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}