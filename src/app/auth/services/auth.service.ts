import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '@envs/environment.development';
import { AuthStatus } from '../types/auth-status.type';
import { AuthUser } from '../interfaces/auth-user.interface';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { map, Observable } from 'rxjs';
import { AuthApi } from '../interfaces/auth-api.interface';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private baseUrl: string = environment.url;

  private _authStatus = signal<AuthStatus>('not-authenticated');
  private _user = signal<AuthUser | null>(null);
  private _token = signal<string | null>(this.localStorageService.getItem('tokenApi'));

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });
  user = computed<AuthUser | null>(() => this._user());
  tokenApi = computed<string | null>(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    const body = { email, password };
    return this.http
      .post<AuthApi>(`${this.baseUrl}/api/auth/login`, body)
      .pipe(map((resp) => this.handleAuthSuccess(resp)));
  }

  register(name: string, email: string, password: string): Observable<AuthApi> {
    return this.http.post<AuthApi>(`${this.baseUrl}/api/auth/register`, { name, email, password });
  }

  logout(): void {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    this.localStorageService.removeItem('tokenApi');
  }

  private handleAuthSuccess(resp: AuthApi) {
    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);
    this.localStorageService.setItem('tokenApi', resp.token);
    return true;
  }

  getToken(): string | null {
    return this.localStorageService.getItem('tokenApi');
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.getItem('tokenApi');
  }
}
