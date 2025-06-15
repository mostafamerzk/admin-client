# Environment Configuration Guide

This guide explains how to configure and use different environments in the ConnectChain Admin Client.

## Environment Files

The application supports multiple environment configurations through environment files:

### `.env.production`
Used for production deployments with real backend API integration.

```env
# Production Environment
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_USE_MOCK_API=false
REACT_APP_ENVIRONMENT=production
REACT_APP_AUTH_TOKEN_KEY=connectchain_auth_token
REACT_APP_USER_DATA_KEY=connectchain_user_data
```

### `.env.mock`
Used for development with mock API data.

```env
# Mock Development Environment
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_USE_MOCK_API=true
REACT_APP_ENVIRONMENT=development
REACT_APP_AUTH_TOKEN_KEY=connectchain_auth_token
REACT_APP_USER_DATA_KEY=connectchain_user_data
```

## Available Scripts

### Development Scripts
- `npm start` - Start with default environment (development)
- `npm run start:mock` - Start with mock API environment
- `npm run start:prod` - Start with production environment settings

### Build Scripts
- `npm run build` - Build with default environment
- `npm run build:mock` - Build with mock API environment
- `npm run build:prod` - Build with production environment

## Configuration Variables

### Environment Variables
- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_USE_MOCK_API` - Enable/disable mock API (true/false)
- `REACT_APP_ENVIRONMENT` - Environment name (development/production)
- `REACT_APP_AUTH_TOKEN_KEY` - Local storage key for auth token
- `REACT_APP_USER_DATA_KEY` - Local storage key for user data

### API Configuration
- `API_TIMEOUT` - Request timeout (30 seconds)
- `API_RETRY_ATTEMPTS` - Number of retry attempts (3)
- `API_CACHE_TTL` - Cache time-to-live (5 minutes)

## Usage Examples

### Development with Mock API
```bash
npm run start:mock
```
This will start the application using mock data, perfect for development without a backend.

### Production Testing
```bash
npm run start:prod
```
This will start the application with production settings, connecting to your real backend API.

### Building for Production
```bash
npm run build:prod
```
This creates an optimized production build with production environment settings.

## API Client Features

The enhanced API client includes:

### Enhanced Configuration
- Configurable timeout (30 seconds default)
- CORS support with proper headers
- Retry mechanism with exponential backoff
- Request/response caching

### Headers
- `Content-Type: application/json`
- `Accept: application/json`
- `X-Requested-With: XMLHttpRequest` (for CORS)

### Error Handling
- Automatic retry on failed requests
- Comprehensive error responses
- Request metadata tracking

## Switching Between Environments

### For Development
1. Use mock environment for UI development: `npm run start:mock`
2. Use production environment for integration testing: `npm run start:prod`

### For Deployment
1. Update `.env.production` with your actual backend URL
2. Build with production settings: `npm run build:prod`
3. Deploy the built files

## Customization

To customize the configuration:

1. **Update Environment Files**: Modify `.env.production` or `.env.mock`
2. **Update Constants**: Modify `src/constants/config.ts` for additional configuration
3. **API Client**: Enhance `src/api/client/index.ts` for custom API behavior

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows the frontend domain
2. **API Timeout**: Increase `API_TIMEOUT` in config if needed
3. **Mock API Not Working**: Verify `REACT_APP_USE_MOCK_API=true` in environment file

### Debug Mode

Enable API logging in development by checking the `ENABLE_API_LOGGING` configuration in `src/constants/config.ts`.
