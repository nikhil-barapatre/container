// Token-based authentication utility
export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';

  // Generate a simple JWT-like token (for demo purposes)
  static generateToken(email: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      email, 
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa(`${header}.${payload}.secret`);
    return `${header}.${payload}.${signature}`;
  }

  // Set token in cookie
  static setToken(token: string): void {
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    
    document.cookie = `${this.TOKEN_KEY}=${token}; path=/; expires=${expiry.toUTCString()}; secure; samesite=lax`;
    document.cookie = `${this.TOKEN_EXPIRY_KEY}=${expiry.getTime()}; path=/; expires=${expiry.toUTCString()}; secure; samesite=lax`;
  }

  // Get token from cookie
  static getToken(): string | null {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${this.TOKEN_KEY}=`));
    
    if (!tokenCookie) return null;
    
    const token = tokenCookie.split('=')[1];
    
    // Check if token is expired
    if (this.isTokenExpired()) {
      this.clearToken();
      return null;
    }
    
    return token;
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    const cookies = document.cookie.split(';');
    const expiryCookie = cookies.find(cookie => cookie.trim().startsWith(`${this.TOKEN_EXPIRY_KEY}=`));
    
    if (!expiryCookie) return true;
    
    const expiryTime = parseInt(expiryCookie.split('=')[1]);
    return Date.now() > expiryTime;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Clear token (logout)
  static clearToken(): void {
    document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`;
    document.cookie = `${this.TOKEN_EXPIRY_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`;
  }

  // Decode token payload (for demo purposes)
  static decodeToken(token: string): unknown {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      return null;
    }
  }
}
