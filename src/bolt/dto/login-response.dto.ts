export class BoltUserDto {
    id: string;
    name: string;
    email: string;
  }
  
  export class BoltLoginResponseDto {
    success: boolean;
    token: string;
    user: BoltUserDto;
    expiresIn: number;
  }