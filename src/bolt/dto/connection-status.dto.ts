import { ApiResponseDto } from "./api-response.dto";

export class ConnectionStatusData {
  bolt: boolean;
  uber: boolean;
  lyft: boolean;
  
  constructor() {
    this.bolt = false;
    this.uber = false;
    this.lyft = false;
  }
}

export class ConnectionStatusResponseDto extends ApiResponseDto<ConnectionStatusData> {}