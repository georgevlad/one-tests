export class ApiResponseDto<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export class BoltLoginDataDto {
    resend_confirmation_interval_ms: number;
  }
  
  export class BoltLoginResponseDto extends ApiResponseDto<BoltLoginDataDto> {}
  
  export class BoltConfirmLoginDataDto {
    userId: string;
    token: string;
    authorization_header: string;
    first_name: string;
    last_name: string;
    email: string;
    expiresIn: number;
  }
  
  export class BoltConfirmLoginResponseDto extends ApiResponseDto<BoltConfirmLoginDataDto> {}
  
    export class PaymentDataDto {
        paymentInstrumentId: string | null;
    }

  export class PaymentDataResponseDto extends ApiResponseDto<PaymentDataDto> {}
  
  export class FavoriteAddressResponseDto extends ApiResponseDto<any> {}
  
  export class SearchRidesResponseDto extends ApiResponseDto<any> {}