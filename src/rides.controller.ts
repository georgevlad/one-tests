import { Controller, Post, Get, Body } from '@nestjs/common';
import { BoltService } from './bolt/bolt.service';
import { SearchRidesRequestDto } from './bolt/dto/search-rides-request.dto';
import { SimplifiedRideResponseDto } from './bolt/dto/simplified-ride-response.dto';
import { BoltDeeplinkService } from './bolt/bolt-deeplink.service';
import { GetFavoriteAddressDto } from './bolt/dto/get-favorite-address.dto';

@Controller()
export class RidesController {
  constructor(
    private readonly boltService: BoltService,
    private readonly deeplinkService: BoltDeeplinkService
  ) {}
  
  @Post('check-connection-status')
  async checkConnectionStatus(@Body() addressRequestDto: GetFavoriteAddressDto): Promise<any> {
    // Create response object with default values
    const responseDto = {
      bolt: false,
      uber: false,  // Hardcoded for now
      lyft: false   // Hardcoded for now
    };
    
    try {
      const boltResponse = await this.boltService.getFavoriteAddresses(addressRequestDto);
      responseDto.bolt = boltResponse.success && boltResponse.data?.message === "OK";
    } catch (error) {
      console.error('Error checking Bolt connection:', error);
    }
    
    return responseDto;
  }

  @Post('search-rides')
  async searchRides(@Body() searchRidesRequestDto: SearchRidesRequestDto): Promise<SimplifiedRideResponseDto> {
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