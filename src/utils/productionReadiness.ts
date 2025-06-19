/**
 * Production Readiness Checker
 * 
 * This utility checks if the application is properly configured for production deployment.
 */

import { API_URL, USE_MOCK_API, ENVIRONMENT } from '../constants/config';

interface ReadinessCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  critical: boolean;
}

interface ReadinessReport {
  overall: 'ready' | 'not-ready' | 'warnings';
  checks: ReadinessCheck[];
  criticalIssues: number;
  warnings: number;
}

/**
 * Performs comprehensive production readiness checks
 */
export const checkProductionReadiness = (): ReadinessReport => {
  const checks: ReadinessCheck[] = [];

  // Check 1: API URL Configuration
  if (API_URL.includes('localhost') || API_URL.includes('127.0.0.1')) {
    checks.push({
      name: 'API URL Configuration',
      status: 'fail',
      message: `API URL points to localhost (${API_URL}). This will fail in production.`,
      critical: true
    });
  } else if (API_URL.startsWith('http://')) {
    checks.push({
      name: 'API URL Security',
      status: 'warning',
      message: 'API URL uses HTTP instead of HTTPS. Consider using HTTPS for production.',
      critical: false
    });
  } else {
    checks.push({
      name: 'API URL Configuration',
      status: 'pass',
      message: 'API URL is properly configured for production.',
      critical: false
    });
  }

  // Check 2: Mock API Usage
  if (USE_MOCK_API && ENVIRONMENT === 'production') {
    checks.push({
      name: 'Mock API Usage',
      status: 'fail',
      message: 'Mock API is enabled in production environment. This will prevent real API calls.',
      critical: true
    });
  } else if (!USE_MOCK_API) {
    checks.push({
      name: 'Mock API Usage',
      status: 'pass',
      message: 'Mock API is disabled, real API will be used.',
      critical: false
    });
  }

  // Check 3: Environment Configuration
  if (ENVIRONMENT !== 'production' && process.env.NODE_ENV === 'production') {
    checks.push({
      name: 'Environment Configuration',
      status: 'warning',
      message: 'NODE_ENV is production but REACT_APP_ENVIRONMENT is not. This may cause confusion.',
      critical: false
    });
  } else {
    checks.push({
      name: 'Environment Configuration',
      status: 'pass',
      message: 'Environment variables are properly configured.',
      critical: false
    });
  }

  // Check 4: Required Environment Variables
  const requiredVars = [
    'REACT_APP_API_URL',
    'REACT_APP_USE_MOCK_API',
    'REACT_APP_ENVIRONMENT'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    checks.push({
      name: 'Required Environment Variables',
      status: 'fail',
      message: `Missing required environment variables: ${missingVars.join(', ')}`,
      critical: true
    });
  } else {
    checks.push({
      name: 'Required Environment Variables',
      status: 'pass',
      message: 'All required environment variables are present.',
      critical: false
    });
  }

  // Check 5: Console Logging in Production
  if (process.env.NODE_ENV === 'production') {
    checks.push({
      name: 'Console Logging',
      status: 'warning',
      message: 'Consider removing or reducing console.log statements in production for performance.',
      critical: false
    });
  }

  // Check 6: Error Reporting Configuration
  // This would check if error reporting service is configured
  checks.push({
    name: 'Error Reporting',
    status: 'warning',
    message: 'No error reporting service detected. Consider integrating Sentry or similar service.',
    critical: false
  });

  // Calculate summary
  const criticalIssues = checks.filter(check => check.status === 'fail' && check.critical).length;
  const warnings = checks.filter(check => check.status === 'warning').length;
  
  let overall: 'ready' | 'not-ready' | 'warnings';
  if (criticalIssues > 0) {
    overall = 'not-ready';
  } else if (warnings > 0) {
    overall = 'warnings';
  } else {
    overall = 'ready';
  }

  return {
    overall,
    checks,
    criticalIssues,
    warnings
  };
};

/**
 * Logs production readiness report to console
 */
export const logProductionReadiness = (): void => {
  const report = checkProductionReadiness();
  
  console.log('🔍 Production Readiness Check');
  console.log('================================');
  
  if (report.overall === 'ready') {
    console.log('✅ Application is ready for production deployment');
  } else if (report.overall === 'warnings') {
    console.log('⚠️  Application has warnings but can be deployed');
  } else {
    console.log('❌ Application is NOT ready for production deployment');
  }
  
  console.log(`Critical Issues: ${report.criticalIssues}`);
  console.log(`Warnings: ${report.warnings}`);
  console.log('');
  
  report.checks.forEach(check => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${check.name}: ${check.message}`);
  });
  
  if (report.criticalIssues > 0) {
    console.log('');
    console.log('🚨 CRITICAL ISSUES MUST BE FIXED BEFORE PRODUCTION DEPLOYMENT');
  }
};

/**
 * Runs production readiness check only in appropriate environments
 */
export const runProductionReadinessCheck = (): void => {
  // Only run in development or when explicitly building for production
  if (process.env.NODE_ENV === 'development' || 
      (process.env.NODE_ENV === 'production' && ENVIRONMENT === 'production')) {
    logProductionReadiness();
  }
};
