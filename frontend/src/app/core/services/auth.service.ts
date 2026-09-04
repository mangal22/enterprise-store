import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser { userId: string; name: string; email: string; token: string; }
export interface Credentials { name?: string; email: string; password: string; }

/**
 * Handles authentication state for the Angular app.
 * It stores the current user in localStorage and exposes a reactive signal so components can react to login state changes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userState = signal<AuthUser | null>(this.readUser());
  readonly user = this.userState.asReadonly();
  readonly isLoggedIn = computed(() => this.userState() !== null);

  /**
   * Registers a new account and saves the returned auth payload into the local app state.
   */
  register(credentials: Credentials): Observable<AuthUser> { return this.http.post<AuthUser>('http://localhost:8093/api/auth/register', credentials).pipe(tap(user => this.setUser(user))); }

  /**
   * Logs in an existing user and stores the JWT and profile details for later requests.
   */
  login(credentials: Credentials): Observable<AuthUser> { return this.http.post<AuthUser>('http://localhost:8093/api/auth/login', credentials).pipe(tap(user => this.setUser(user))); }

  /**
   * Clears the stored authentication information and resets the current app user.
   */
  logout(): void { localStorage.removeItem('enterprise_store_user'); localStorage.removeItem('access_token'); this.userState.set(null); }

  /**
   * Persists the authenticated user and token in localStorage.
   */
  private setUser(user: AuthUser): void { localStorage.setItem('enterprise_store_user', JSON.stringify(user)); localStorage.setItem('access_token', user.token); this.userState.set(user); }

  /**
   * Reads a previously logged-in user from localStorage when the app starts.
   */
  private readUser(): AuthUser | null { try { return JSON.parse(localStorage.getItem('enterprise_store_user') ?? 'null') as AuthUser | null; } catch { return null; } }
}
