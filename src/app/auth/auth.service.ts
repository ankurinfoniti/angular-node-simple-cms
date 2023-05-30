import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment as env } from 'src/environments/environment';
import { Auth } from './auth-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = '';
  private httpClient = inject(HttpClient);

  getToken() {
    return this.token;
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
        this.token = response.token;
      });
  }
}
