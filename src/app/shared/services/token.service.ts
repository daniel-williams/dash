import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class TokenService {
  accessKey: string = 'access_token';
  refreshKey: string = 'refresh_token';
  hasStorage: boolean = this.checkStorage();
  hasCookies: boolean = this.checkCookies();

  constructor(private cookieService: CookieService) {}

  setTokens(accessToken: string, refreshToken: string): void {
    if(this.hasCookies) {
      // session cookie
      this.cookieService.put(this.accessKey, accessToken);
    }
    if(this.hasStorage) {
      // persist refresh token
      window.localStorage.setItem(this.refreshKey, refreshToken);
    } else if(this.hasCookies) {
      // persist refresh token, server will expire it
      this.cookieService.put(this.refreshKey, refreshToken, {expires: this.getExpiresDate()});
    }
  }

  clearTokens(): void {
    if(this.hasCookies) {
      this.cookieService.remove(this.accessKey);
      this.cookieService.remove(this.refreshKey);
    }
    if(this.hasStorage) {
      window.localStorage.removeItem(this.refreshKey);
    }
  }

  getAccessToken(): string {
    return this.hasCookies ? this.cookieService.get(this.accessKey) : null;
  }

  getRefreshToken(): string {
    let token: string = null;

    if(this.hasStorage) {
      token = window.localStorage.getItem(this.refreshKey);
    } else if(this.hasCookies) {
      token = this.cookieService.get(this.refreshKey);
    }
    return token;
  }

  getTokens(): IToken {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
    };
  }

  // private
  private checkStorage() {
    return window && typeof(window.localStorage) !== 'undefined';
  }

  private checkCookies() {
    return navigator.cookieEnabled;
  }

  private getExpiresDate(): Date {
    let d = new Date();

    d.setDate(d.getDate() + 30);
    
    return d;
  }
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}
