# OneRide API Documentation

This document provides an overview of all available endpoints in the OneRide API which serves as a middleware for ride-hailing services.

## Base URL

The API runs on port 3000 by default.

## General Endpoints

### GET /

Returns a simple message indicating that the API is running.

**Response:**
```
OneRide API is running!
```

### GET /health

Used to check the health of the application.

**Response:**
```
As healthy as it gets!
```

## Bolt Endpoints

The following endpoints are available for interacting with the Bolt ride-hailing service.

### POST /bolt/login

Initiates the login process with Bolt's authentication system by requesting a verification code.

**Request Body:**
```json
{
  "password": "string",
  "version": "string",
  "deviceId": "string",
  "device_name": "string",
  "device_os_version": "string",
  "channel": "string",
  "brand": "string",
  "deviceType": "string",
  "country": "string",
  "gps_lat": "string",
  "gps_lng": "string",
  "userAgent": "string",
  "phone_number": "string",
  "timezone": "string",
  "android_hash_string": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login verification code sent successfully",
  "data": {
    "resend_confirmation_interval_ms": 20000
  }
}
```

### POST /bolt/confirm

Confirms login using the verification code sent to the user's phone.

**Request Body:**
```json
{
  "phone_number": "string",
  "password": "string",
  "code": "string",
  "version": "string",
  "deviceId": "string",
  "device_name": "string",
  "device_os_version": "string",
  "channel": "string",
  "brand": "string",
  "deviceType": "string",
  "country": "string",
  "gps_lat": "string",
  "gps_lng": "string",
  "userAgent": "string",
  "timezone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login confirmed successfully",
  "data": {
    "userId": "string",
    "token": "string",
    "authorization_header": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "expiresIn": 0
  }
}
```

### POST /bolt/payment-data

Retrieves payment instruments associated with the user's account.

**Request Body:**
```json
{
  "userId": "string",
  "authHeader": "string",
  "version": "string",
  "deviceId": "string",
  "device_name": "string",
  "device_os_version": "string",
  "channel": "string",
  "brand": "string",
  "deviceType": "string",
  "country": "string",
  "gps_lat": "string",
  "gps_lng": "string",
  "userAgent": "string",
  "timezone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment data retrieved successfully",
  "data": {
    "paymentInstrumentId": "string"
  }
}
```

### POST /bolt/check-connection-status

Test endpoint to check if the Bolt API is reachable, retrieves user's favorite addresses.

**Request Body:**
```json
{
  "userId": "string",
  "authHeader": "string",
  "version": "string",
  "deviceId": "string",
  "device_name": "string",
  "device_os_version": "string",
  "channel": "string",
  "brand": "string",
  "deviceType": "string",
  "country": "string",
  "gps_lat": "string",
  "gps_lng": "string",
  "userAgent": "string",
  "timezone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bolt API is reachable",
  "data": {
    // Favorite addresses data
  }
}
```

### POST /bolt/search-rides

Searches for available ride options based on origin and destination coordinates.

**Request Body:**
```json
{
  "userId": "string",
  "authHeader": "string",
  "version": "string",
  "deviceId": "string",
  "device_name": "string",
  "device_os_version": "string",
  "channel": "string",
  "brand": "string",
  "deviceType": "string",
  "country": "string",
  "userAgent": "string",
  "timezone": "string",
  "originLat": 0,
  "originLng": 0,
  "destinationLat": 0,
  "destinationLng": 0,
  "paymentTokenId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride options retrieved successfully",
  "data": {
    // Available ride options data
  }
}
```

## Uber Endpoints

TODO

## Error Responses

All endpoints return a standardized error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information"
}
```

## Notes

- The API uses NestJS framework with validation pipes enabled
- All requests and responses follow a consistent format
- All POST endpoints expect JSON payloads in the request body