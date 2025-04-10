export class ConnectionStatusResponseDto {
    bolt: boolean;
    uber: boolean;
    lyft: boolean;
    
    constructor() {
      this.bolt = false;
      this.uber = false;
      this.lyft = false;
    }
  }