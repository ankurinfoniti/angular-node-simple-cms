import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

import { environment as env } from 'src/environments/environment';
import { Auth } from './auth-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string | null = null;
  private userId: string | null = null;
  private tokenTimer!: ReturnType<typeof setTimeout>;
  private authStatusListener = new Subject<boolean>();

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
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
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${env.BASE_URL}/user/login`,
        authData
      )
      .subscribe((response) => {
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          const expirationDate = new Date(
            new Date().getTime() + expiresInDuration * 1000
          );

          this.setAuthTimer(expiresInDuration);

          this.token = response.token;
          this.userId = response.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  authAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn =
      authInformation!?.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation?.token as string;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
