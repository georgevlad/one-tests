import { ApiResponseDto } from "./api-response.dto";

export class BoltConfirmLoginDataDto {
    userId: string;
    token: string;
    authorization_header: string;
    expiresIn: number;
  }
  
  export class BoltConfirmLoginResponseDto extends ApiResponseDto<BoltConfirmLoginDataDto> {}