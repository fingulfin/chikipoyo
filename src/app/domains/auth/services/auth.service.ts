import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  email: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly loginUrl = `${environment.apiUrl}/api/auth/login`;
  private readonly userUrl = `${environment.apiUrl}/api/users/find-by-email`;

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(this.loginUrl, payload);
  }

  getUserByEmail(email: string) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<User>(this.userUrl, { email }, { headers });
  }
}
