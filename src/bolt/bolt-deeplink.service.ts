// src/bolt/bolt-deeplink.service.ts
import { Injectable } from '@nestjs/common';
import { SearchRidesRequestDto } from './dto/search-rides-request.dto';

interface DeeplinkParams {
  client_id: string;  
  pickup_formatted_address: string;  
  pickup_latitude: string; 
  pickup_longitude: string; 
  pickup_title: string; 
  dropoff_formatted_address: string;
  dropoff_latitude: string;
  dropoff_longitude: string; 
  dropoff_title: string; 
  eta_seconds: string;  
  fare_currency: string;  
  fare_high: string;
  fare_low: string; 
  product_id: string;  
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
    let cleanPrice = price.replace(/[^0-9.]/g, '');
    
    // Ensure price has two decimal places
    if (cleanPrice.includes('.')) {
      const parts = cleanPrice.split('.');
      if (parts[1].length === 1) {
        cleanPrice = `${parts[0]}.${parts[1]}0`;
      }
    } else {
      cleanPrice = `${cleanPrice}.00`;
    }
    
    // Set client ID - using GOOGLE_MAPS instead of ONERIDE_API as it works
    const clientId = 'GOOGLE_MAPS'; 
    
    // Create parameters for the deep link 
    const params: DeeplinkParams = {
      client_id: clientId,
      pickup_formatted_address: rideRequest.pickupFormattedAddress,
      pickup_latitude: rideRequest.originLat.toString(),
      pickup_longitude: rideRequest.originLng.toString(),
      pickup_title: rideRequest.pickupFormattedAddress,
      dropoff_formatted_address: rideRequest.dropoffFormattedAddress,
      dropoff_latitude: rideRequest.destinationLat.toString(),
      dropoff_longitude: rideRequest.destinationLng.toString(),
      dropoff_title: rideRequest.dropoffTitle,
      eta_seconds: etaSeconds.toString(),
      fare_currency: fareCurrency,
      fare_high: cleanPrice,
      fare_low: cleanPrice,
      product_id: categoryId,
    };
    
    
    const deepLinkValue = this.generateDeepLinkValue(params);
    
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
      `pickup_formatted_address=${encodeURIComponent(params.pickup_formatted_address)}`,
      `dropoff_formatted_address=${encodeURIComponent(params.dropoff_formatted_address)}`,
      `fare_high=${params.fare_high}`,
      `c=${params.client_id}`,
      `eta_seconds=${params.eta_seconds}`,
      `deep_link_value=${encodeURIComponent(deepLinkValue)}`,
      `dropoff_latitude=${params.dropoff_latitude}`,
      `dropoff_title=${encodeURIComponent(params.dropoff_title)}`,
      `product_id=${params.product_id}`,
      `fare_currency=${params.fare_currency}`,
      `pickup_longitude=${params.pickup_longitude}`,
      `fare_low=${params.fare_low}`,
      `pickup_latitude=${params.pickup_latitude}`,
      `pickup_title=${encodeURIComponent(params.pickup_title)}`,
      `dropoff_longitude=${params.dropoff_longitude}`
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