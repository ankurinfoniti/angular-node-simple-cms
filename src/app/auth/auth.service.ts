import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

import { environment as env } from 'src/environments/environment';
import { Auth } from './auth-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token = '';
  private authStatusListener = new Subject<boolean>();
  private httpClient = inject(HttpClient);

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: Auth = { email: email, password: password };
    this.httpClient
      .post(`${env.BASE_URL}/user/signup`, authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: Auth = { email: email, password: password };
    this.httpClient
      .post<{ token: string }>(`${env.BASE_URL}/user/login`, authData)
      .subscribe((response) => {
        if (response.token) {
          this.token = response.token;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
      });
  }
}
