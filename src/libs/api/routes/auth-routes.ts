export class AuthRoutes {
  static auth = {
    sendOtp: '/api/v1/auth/send-otp',
    forgotPassword: '/auth/reset-password',
    resetPassword: '/auth/set-password',
    verifyOtp: '/api/v1/auth/verify-otp',
    me: '/api/v1/users/me',
    updateProfile: '/api/v1/users/me',
    refresh: '/auth/refresh-token',
  }
  // Dynamic routes using methods
}
