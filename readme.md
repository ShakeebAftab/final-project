# TypeScript Express PostgreSQL Drizzle Starter Template

This starter template is designed to quickly set up a TypeScript-based Express server with Redis, PostgreSQL database integration using Drizzle, along with Docker support. It includes utilities for environment management, logging, response handling, error handling, and more.

## Features

- TypeScript for type-safe development
- Express.js for server-side logic
- PostgreSQL for database management
- Drizzle ORM integration
- Docker support for easy deployment
- Custom request setup for express middleware

## Getting Started

### Prerequisites

- Node.js and npm installed
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:

```bash
   git clone <repository-url>
   cd <project-folder>
```

2. ```bash
   npm install
   ```

**Make sure to update app-name in Docker commands and configurations to your actual application name before usage.**

## Custom Express Request Setup

The template includes a custom request setup in Express to enhance type safety and ease of use. You can extend it further for authentication or other purposes.

## Utilities

- **asyncHandler**: Utility to handle asynchronous functions with error handling.
- **getEnvValue**: Utility to fetch environment variables.
- **respHandler**: Response handling utility.
- **errorHandler**: Error handling utility.
