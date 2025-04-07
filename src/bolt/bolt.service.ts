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
  private readonly baseUrl = 'https://user.live.boltsvc.net';

  constructor(private readonly httpService: HttpService) {}

  async login(loginData: BoltLoginRequestDto): Promise<any> {
    const url = `${this.baseUrl}/profile/verification/start/v2`;
    
    // Get query parameters and headers using the common methods
    const queryParams = this.createQueryParams(loginData);
    const headers = this.createHeaders(loginData);
    
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
      return this.handleApiError(error, 'login');
    }
  }

  async confirmLogin(confirmData: BoltConfirmLoginRequestDto) {
    const url = `${this.baseUrl}/profile/verification/confirm/v3`;
    
    // Get query parameters and headers using the common methods
    const queryParams = this.createQueryParams(confirmData);
    const headers = this.createHeaders(confirmData);
    
    // Construct request body
    const body = {
      type: 'phone', // HARDCODED
      phone_number: confirmData.phone_number,
      password: confirmData.password,
      code: confirmData.code,
      timezone: confirmData.timezone,
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
        const authorizationHeader = this.getAuthorizationHeader(auth.auth_username, confirmData.password);
        
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
      return this.handleApiError(error, 'login confirmation');
    }
  }

  async getPaymentInstrumentData(paymentDataRequest: PaymentDataRequestDto) {
    const url = `${this.baseUrl}/payment/instrument/listWithBalanceData`;
    
    // Parse lat and lng as numbers
    const lat = parseFloat(paymentDataRequest.gps_lat);
    const lng = parseFloat(paymentDataRequest.gps_lng);
    
    // Get query parameters and headers using the common methods
    const queryParams = this.createQueryParams(paymentDataRequest, paymentDataRequest.userId);
    const headers = this.createAuthHeaders(paymentDataRequest.userAgent, paymentDataRequest.version, paymentDataRequest.authHeader);
    
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
      return this.handleApiError(error, 'fetching payment instrument data');
    }
  }

  async getFavoriteAddresses(addressRequestDto: GetFavoriteAddressDto) {
    const url = `${this.baseUrl}/profile/favoriteAddress/list`;
    
    // Get query parameters and headers using the common methods
    const queryParams = {
      ...this.createQueryParams(addressRequestDto, addressRequestDto.userId),
      include_custom_addresses: 'true', // HARDCODED
    };
    
    const headers = this.createAuthHeaders(
      addressRequestDto.userAgent, 
      addressRequestDto.version, 
      addressRequestDto.authHeader
    );
    
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
      return this.handleApiError(error, 'fetching favorite addresses');
    }
  }
  
  async searchRideOptions(searchRidesRequestDto: SearchRidesRequestDto) {
    const url = `${this.baseUrl}/rides/search/getRideOptions`;
  
    // Get query parameters and headers using the common methods
    const queryParams = this.createQueryParams(searchRidesRequestDto, searchRidesRequestDto.userId);
    const headers = this.createAuthHeaders(
      searchRidesRequestDto.userAgent, 
      searchRidesRequestDto.version, 
      searchRidesRequestDto.authHeader,
      true // Include Content-Type header
    );
  
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
      return this.handleApiError(error, 'searching ride options');
    }
  }

  // Common methods for reusability
  
  /**
   * Creates common query parameters for Bolt API requests
   */
  private createQueryParams(data: any, userId?: string): Record<string, string> {
    const deviceId = data.deviceId;
    const sessionId = userId 
      ? `${userId}u${Date.now()}`
      : `${deviceId}u${Date.now()}`;
    
    const distinctId = userId
      ? `client-${userId}`
      : `%24device%3A${this.generateUUID()}`;
      
    const rhSessionId = userId 
      ? `${userId}u${Math.floor(Date.now() / 1000)}`
      : `${deviceId}u${Math.floor(Date.now() / 1000)}`;
    
    return {
      version: data.version,
      deviceId: data.deviceId,
      device_name: data.device_name,
      device_os_version: data.device_os_version,
      channel: data.channel,
      brand: data.brand,
      deviceType: data.deviceType,
      signup_session_id: '', // HARDCODED
      country: data.country,
      is_local_authentication_available: 'false', // HARDCODED
      language: 'en', // HARDCODED
      gps_lat: data.gps_lat || (userId ? data.originLat.toString() : null),
      gps_lng: data.gps_lng || (userId ? data.originLng.toString() : null),
      gps_accuracy_m: '10.0', // HARDCODED
      gps_age: userId ? '0' : '32', // Different for authenticated vs unauthenticated
      session_id: sessionId,
      distinct_id: distinctId,
      rh_session_id: rhSessionId,
      ...(userId && { user_id: userId }), // Only add user_id if provided
    };
  }

  /**
   * Creates common headers for Bolt API requests
   */
  private createHeaders(data: any): Record<string, string> {
    const traceId = this.generateTraceId();
    const spanId = this.generateSpanId();
    
    return {
      'Accept-Encoding': 'gzip',
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${data.version}%2B3240,sentry-trace_id=${traceId}`,
      'Connection': 'Keep-Alive',
      'Content-Type': 'application/json; charset=UTF-8',
      'Host': 'user.live.boltsvc.net',
      'sentry-trace': `${traceId}-${spanId}`,
      'User-Agent': data.userAgent,
    };
  }
  
  /**
   * Creates authenticated headers for Bolt API requests
   */
  private createAuthHeaders(userAgent: string, version: string, authHeader: string, includeContentType = false): Record<string, string> {
    const traceId = this.generateTraceId();
    const spanId = this.generateSpanId();
    
    const headers: Record<string, string> = {
      'Accept-Encoding': 'gzip',
      'Authorization': authHeader,
      'baggage': `sentry-environment=production,sentry-public_key=fb5f34fc26a081ff4100b68d3c9c1a42,sentry-release=ee.mtakso.client%40${version}%2B3240,sentry-trace_id=${traceId}`,
      'Connection': 'Keep-Alive',
      'Host': 'user.live.boltsvc.net',
      'sentry-trace': `${traceId}-${spanId}`,
      'User-Agent': userAgent,
    };
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json; charset=UTF-8';
    }
    
    return headers;
  }
  
  /**
   * Standard error handler for API responses
   */
  private handleApiError(error: any, operation: string): any {
    console.error(`Error during ${operation}:`, error);
    
    return {
      success: false,
      message: `${operation} request failed`,
      details: error.message || 'An unexpected error occurred',
      code: error.response?.status || 500,
      errorData: error.response?.data || null
    };
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