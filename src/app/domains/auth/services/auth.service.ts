import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

export interface PasswordUpdateRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly loginUrl = `${environment.apiUrl}/api/auth/login`;
  private readonly userUrl = `${environment.apiUrl}/api/users/find-by-email`;
  private readonly passwordUrl = 'http://localhost:8080/api/users/password';

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

  updateUser(user: User) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put<User>(`${environment.apiUrl}/api/users`, user, {
      headers,
    });
  }

  updatePassword(request: PasswordUpdateRequest) {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('token')
        : null;
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.put<void>(this.passwordUrl, request, { headers });
  }
}
