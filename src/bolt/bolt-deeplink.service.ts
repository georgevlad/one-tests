// src/bolt/services/bolt-deeplink.service.ts
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
 
}