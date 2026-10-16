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
  private readonly userUrl = `${environment.apiUrl}/api/users/email`;

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(this.loginUrl, payload);
  }

  getUserByEmail(email: string) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
   const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log("Fetching user by email: " + email + " with token: " + token);
//Mio antes
console.log("Headers"+JSON.stringify(headers));

    // 3. Make the GET request passing options as the second argument
    this.http.get<any>(this.userUrl+"/"+email, { headers })
      .subscribe({
        next: (response) => {
       
          console.log('Success:', response);
        },
        error: (err) => {
          console.error('Request failed:', err);
        }
      });




    return this.http.get<User>(`${this.userUrl}/${email}`, { headers });
  }
}
