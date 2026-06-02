/**
 * Application Messages
 */
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    TOKEN_VALID: 'Token is valid',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_DEACTIVATED: 'Account is deactivated',
    USER_EXISTS: 'User with this email already exists',
    AUTHENTICATION_FAILED: 'Authentication failed',
    NO_TOKEN: 'No token provided',
    INVALID_TOKEN: 'Invalid or expired token',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    ADMIN_REQUIRED: 'Forbidden - Admin access required',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_UPDATED: 'Password updated successfully',
    CURRENT_PASSWORD_INVALID: 'Current password is incorrect',
  },
  VALIDATION: {
    ERROR: 'Validation error',
  },
  DONATION: {
    CREATED: 'Donation created successfully',
  },
  ERROR: {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    REQUEST_TIMEOUT: 'Request timeout',
  },
  CONTACT: {
    SENT: 'Message sent successfully',
    FAILED: 'Failed to send message',
  },
  SETTINGS: {
    UPDATED: 'Settings updated successfully',
    FETCH_FAILED: 'Failed to load settings',
  },
} as const;

