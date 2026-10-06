import { computed, Injectable, signal } from '@angular/core';
import { UserClaims } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'auth_token';

  readonly token = signal<string | null>(null);
  readonly currentUser = signal<UserClaims | null>(null);
  readonly isAuthenticated = computed(() => !!this.token());

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const savedToken = localStorage.getItem(this.storageKey);
    if (savedToken) {
      this.applyToken(savedToken, false);
    }
  }

  setToken(token: string): void {
    this.applyToken(token, true);
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  private applyToken(token: string, persist: boolean): void {
    this.token.set(token);
    this.currentUser.set(this.extractClaims(token));

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, token);
    }
  }

  private extractClaims(token: string): UserClaims | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const parsed = JSON.parse(jsonPayload);
      const id = parsed.sub || parsed.id || '';
      const email = parsed.email || '';

      if (!id && !email) {
        return null;
      }

      return { id, email };
    } catch {
      return null;
    }
  }
}
