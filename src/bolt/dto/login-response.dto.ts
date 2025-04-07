import { ApiResponseDto } from "./api-response.dto";

export class BoltLoginDataDto {
  resend_confirmation_interval_ms: number;
}

export class BoltLoginResponseDto extends ApiResponseDto<BoltLoginDataDto> {}