import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BoltLoginRequestDto } from './dto/login-request.dto';
import { BoltLoginResponseDto } from './dto/login-response.dto';

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