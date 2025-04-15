import { Controller, Post, Get, Body, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

import { BoltService } from './bolt/bolt.service';
import { SearchRidesRequestDto } from './bolt/dto/search-rides-request.dto';
import { SimplifiedRideResponseDto } from './bolt/dto/simplified-ride-response.dto';
import { BoltDeeplinkService } from './bolt/bolt-deeplink.service';
import { GetFavoriteAddressDto } from './bolt/dto/get-favorite-address.dto';
import { ConnectionStatusData, ConnectionStatusResponseDto } from './bolt/dto/connection-status.dto';

@Controller()
export class RidesController {
  constructor(
    private readonly boltService: BoltService,
    private readonly deeplinkService: BoltDeeplinkService
  ) {}
  
  @Post('check-connection-status')
  async checkConnectionStatus(@Body() addressRequestDto: GetFavoriteAddressDto): Promise<ConnectionStatusResponseDto> {
    // Create response object
    const connectionResponse = new ConnectionStatusResponseDto();
    const connectionData = new ConnectionStatusData();
    
    try {
      // If boltAuthHeader is provided, check Bolt connection
      if (addressRequestDto.boltAuthHeader) {
        const boltResponse = await this.boltService.getFavoriteAddresses(addressRequestDto);
        connectionData.bolt = boltResponse.success && boltResponse.data?.message === "OK";
      }
      
      // Set the response data
      connectionResponse.success = true;
      connectionResponse.message = "Connection status retrieved successfully";
      connectionResponse.data = connectionData;
    } catch (error) {
      console.error('Error checking connection status:', error);
      connectionResponse.success = false;
      connectionResponse.message = "Failed to retrieve connection status";
      connectionResponse.error = error.message || "An unexpected error occurred";
    }
    
    return connectionResponse;
  }
  
  // Original POST endpoint
  @Post('search-rides')
  async searchRidesPost(@Body() searchRidesRequestDto: SearchRidesRequestDto): Promise<SimplifiedRideResponseDto> {
    return this.searchRidesHandler(searchRidesRequestDto);
  }

  // New GET endpoint
  @Get('search-rides')
  async searchRidesGet(@Query() query: any): Promise<SimplifiedRideResponseDto> {
    try {
      // Convert string values to the proper types
      const searchRequest = new SearchRidesRequestDto();
      
      // Map all string properties directly
      Object.keys(query).forEach(key => {
        if (typeof query[key] === 'string') {
          searchRequest[key] = query[key];
        }
      });
      
      // Convert numeric properties
      if (query.originLat) searchRequest.originLat = parseFloat(query.originLat);
      if (query.originLng) searchRequest.originLng = parseFloat(query.originLng);
      if (query.destinationLat) searchRequest.destinationLat = parseFloat(query.destinationLat);
      if (query.destinationLng) searchRequest.destinationLng = parseFloat(query.destinationLng);
      
      return this.searchRidesHandler(searchRequest);
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Failed to process GET request',
        error: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }

  // Common handler for both endpoints
  private async searchRidesHandler(searchRidesRequestDto: SearchRidesRequestDto): Promise<SimplifiedRideResponseDto> {
    const response = await this.boltService.searchRideOptions(searchRidesRequestDto);
    
    const searchResponse = new SimplifiedRideResponseDto();
    
    if (response.success) {
      // Transform the complex ride options response into a simplified format
      const simplifiedRides = this.boltService.transformRideOptions(response.data, searchRidesRequestDto);
      
      searchResponse.success = true;
      searchResponse.message = "Ride options retrieved successfully";
      searchResponse.data = simplifiedRides;
    } else {
      searchResponse.success = false;
      searchResponse.message = response.message || "Failed to retrieve ride options";
      searchResponse.error = response.details || "An error occurred while searching for ride options";
    }
    
    return searchResponse;
  }

}