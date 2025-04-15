import { ApiResponseDto } from './api-response.dto';

export class SimplifiedRideDto {
  ride_name: string;
  price: string;
  ride_description: string;
  category_id: string;
  eta: string;
  icon_url: string;
  type: string;
  deeplink?: string;
}

export class SimplifiedRideResponseDto extends ApiResponseDto<SimplifiedRideDto[]> {}