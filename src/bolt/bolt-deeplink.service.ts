// src/bolt/bolt-deeplink.service.ts
import { Injectable } from '@nestjs/common';
import { SearchRidesRequestDto } from './dto/search-rides-request.dto';

interface DeeplinkParams {
  clientId: string;
  dropoffFormattedAddress: string;
  dropoffLatitude: string;
  dropoffLongitude: string;
  dropoffTitle: string;
  etaSeconds: string;
  fareCurrency: string;
  fareHigh: string;
  fareLow: string;
  pickupFormattedAddress: string;
  pickupLatitude: string;
  pickupLongitude: string;
  pickupTitle: string;
  productId: string;
}

@Injectable()
export class BoltDeeplinkService {
  /**
   * Generate a deep link for Bolt app from ride search results
   * @param rideRequest The original search request
   * @param categoryId The category/product ID of the selected ride
   * @param price The price of the ride (string format, e.g. "10.50")
   * @param etaSeconds Estimated time of arrival in seconds
   * @param fareCurrency Currency of the fare (e.g., 'USD', 'EUR', 'RON')
   * @returns A URL string that opens the Bolt app with pre-filled ride details
   */
  generateDeeplink(
    rideRequest: SearchRidesRequestDto,
    categoryId: string,
    price: string,
    etaSeconds: number = 300, // Default to 5 minutes if not available
    fareCurrency: string = 'RON', // Default currency if not available
  ): string {
    // Clean the price string - remove any non-numeric characters except decimal point
    const cleanPrice = price.replace(/[^0-9.]/g, '');
    
    // Set client ID - typically the source of the request
    const clientId = 'ONERIDE_API'; 
    
    // Create parameters for the deep link
    const params: DeeplinkParams = {
      clientId,
      dropoffFormattedAddress: rideRequest.dropoffFormattedAddress,
      dropoffLatitude: rideRequest.destinationLat.toString(),
      dropoffLongitude: rideRequest.destinationLng.toString(),
      dropoffTitle: rideRequest.dropoffTitle,
      etaSeconds: etaSeconds.toString(),
      fareCurrency,
      fareHigh: cleanPrice,
      fareLow: cleanPrice,
      pickupFormattedAddress: rideRequest.pickupFormattedAddress,
      pickupLatitude: rideRequest.originLat.toString(),
      pickupLongitude: rideRequest.originLng.toString(),
      pickupTitle: rideRequest.pickupTitle,
      productId: categoryId,
    };
    
    // Generate the deep link value (the part after deep_link_value=)
    const deepLinkValue = this.generateDeepLinkValue(params);
    
    // Construct the OneLink URL with all parameters
    return this.constructOneLinkUrl(params, deepLinkValue);
  }
  
  /**
   * Generates the taxify deep link value portion
   */
  private generateDeepLinkValue(params: DeeplinkParams): string {
    // Create the base URL for the deep link
    const baseUrl = 'taxify://action/bookaride';
    
    // Create query parameters
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    // Return the full deep link value
    return `${baseUrl}?${queryParams}`;
  }
  
  /**
   * Constructs the full OneLink URL for Bolt
   */
  private constructOneLinkUrl(params: DeeplinkParams, deepLinkValue: string): string {
    // Base OneLink URL (with the provided sbJ2/32a2267d path segments)
    const baseUrl = 'https://bolt.onelink.me/ch/sbJ2/32a2267d';
    
    // OneLink params includes both deep link value and all the original params again
    const queryParams = [
      `pickup_formatted_address=${encodeURIComponent(params.pickupFormattedAddress)}`,
      `dropoff_formatted_address=${encodeURIComponent(params.dropoffFormattedAddress)}`,
      `fare_high=${params.fareHigh}`,
      `c=${params.clientId}`,
      `eta_seconds=${params.etaSeconds}`,
      `deep_link_value=${encodeURIComponent(deepLinkValue)}`,
      `dropoff_latitude=${params.dropoffLatitude}`,
      `dropoff_title=${encodeURIComponent(params.dropoffTitle)}`,
      `product_id=${params.productId}`,
      `fare_currency=${params.fareCurrency}`,
      `pickup_longitude=${params.pickupLongitude}`,
      `fare_low=${params.fareLow}`,
      `pickup_latitude=${params.pickupLatitude}`,
      `pickup_title=${encodeURIComponent(params.pickupTitle)}`,
      `dropoff_longitude=${params.dropoffLongitude}`
    ].join('&');
    
    // Return the complete OneLink URL
    return `${baseUrl}?${queryParams}`;
  }
  
  /**
   * Extracts the ETA seconds from a formatted ETA string
   * @param etaString ETA string like "5 min"
   * @returns Number of seconds
   */
  extractEtaSeconds(etaString: string): number {
    // Default value if parsing fails
    const defaultEtaSeconds = 300; // 5 minutes
    
    if (!etaString) {
      return defaultEtaSeconds;
    }
    
    // Try to extract minutes from strings like "5 min" or "5-10 min"
    const minutesMatch = etaString.match(/(\d+)(?:-\d+)?\s*min/);
    if (minutesMatch && minutesMatch[1]) {
      const minutes = parseInt(minutesMatch[1], 10);
      return minutes * 60; // Convert to seconds
    }
    
    return defaultEtaSeconds;
  }
  
  /**
   * Extracts currency from price string (if available)
   * @param priceString Price string like "$10.50" or "10.50 USD" or "LEI 17.0"
   * @returns Currency code or default value
   */
  extractCurrency(priceString: string): string {
    const defaultCurrency = 'RON';
    
    if (!priceString) {
      return defaultCurrency;
    }
    
    // Check for common currency symbols and their corresponding codes
    if (priceString.includes('$')) return 'USD';
    if (priceString.includes('€')) return 'EUR';
    if (priceString.includes('£')) return 'GBP';
    if (priceString.includes('LEI')) return 'RON';
    
    // For other currencies, try to extract from string like "10.50 USD"
    const currencyMatch = priceString.match(/[0-9.,]+\s*([A-Z]{3})/);
    if (currencyMatch && currencyMatch[1]) {
      return currencyMatch[1];
    }
    
    return defaultCurrency;
  }
}