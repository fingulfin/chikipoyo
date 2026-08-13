import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly loginUrl = `${environment.apiUrl}/api/auth/login`;

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(this.loginUrl, payload);
  }
}
