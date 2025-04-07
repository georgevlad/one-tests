# OneRide API

OneRide API is a unified middleware service that provides standardized access to multiple ride-hailing platforms through a single interface. The project currently integrates with Bolt and Uber (TODO)

## Project Description

The OneRide API serves as an abstraction layer between client applications and various ride-hailing service providers.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
- **HTTP Client**: [@nestjs/axios](https://docs.nestjs.com/techniques/http-module) - NestJS HTTP module for making external API requests
- **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer) - For request payload validation and transformation
- **Testing**: [Jest](https://jestjs.io/) - JavaScript testing framework with a focus on simplicity
- **API Testing**: [SuperTest](https://github.com/visionmedia/supertest) - HTTP assertions made easy for testing APIs
- **Code Quality**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - For code linting and formatting

## Project Structure

The project follows the NestJS modular architecture:

- `src/` - Source code directory
  - `app.module.ts` - Main application module
  - `main.ts` - Application entry point
  - `bolt/` - Module for Bolt ride-hailing service integration
    - `dto/` - Data Transfer Objects for requests and responses
    - `bolt.controller.ts` - API endpoints for Bolt service
    - `bolt.service.ts` - Business logic for Bolt integration
  - `uber/` - Module for Uber integration
- `test/` - Test files directory

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/one-api.git

# Navigate to the project directory
cd one-api

# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

### Running Tests

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

For detailed API documentation, see the [API_DOCS.md](API_DOCS.md) file.

## TODOs

- Uber service integration
- Ride cost comparison across providers
- Ride scheduling features
- User preferences and settings synchronization
- Additional ride-hailing service integrations (Lyft, etc.)
- Caching layer for improved performance
- Rate limiting and additional security features

## License

This project is licensed under the [MIT License](LICENSE).