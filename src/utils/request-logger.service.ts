import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RequestLoggerService {
  private readonly logDir = path.join(process.cwd(), 'logs');

  constructor() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Logs request data to a JSON file
   * @param serviceName Name of the service making the request (e.g., 'bolt')
   * @param methodName Name of the method making the request (e.g., 'confirmLogin')
   * @param requestData Object containing request details (url, headers, body, etc.)
   */
  async logRequest(serviceName: string, methodName: string, requestData: any): Promise<void> {
    try {
      return; // Temporarily disable logging for performance reasons
      // Create timestamp for filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${serviceName}_${methodName}_${timestamp}.json`;
      const filePath = path.join(this.logDir, fileName);

      // Prepare log data with timestamp and request info
      const logData = {
        timestamp: new Date().toISOString(),
        service: serviceName,
        method: methodName,
        request: requestData
      };

      // Write to file asynchronously
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(logData, null, 2),
        'utf8'
      );

      console.log(`Request logged to ${filePath}`);
    } catch (error) {
      console.error('Error logging request:', error);
    }
  }
}