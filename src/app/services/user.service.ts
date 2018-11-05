import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin } from '../components/login/UserLogin';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly rootUrl = 'http://localhost:5000';
  private token: string = '';
  private tokenExpirationDate : Date;
  private isLoggedIn = false;

  constructor(private http: HttpClient) { }

  isUserLoggedIn() 
  {
    return this.isLoggedIn;
  }

  public get loginRequired(): boolean
  {
    return this.token.length == 0 || this.tokenExpirationDate > new Date();
  }

  login(loginCredentials): Observable<boolean>
  {
    const body: UserLogin = 
    {
      Username: loginCredentials.Username,
      Password: loginCredentials.Password
    }
    return this.http.post(this.rootUrl + '/API/Users/Login', body)
      .pipe(tap((data: any) => {
        console.log(data);
        this.token = data.token;
        localStorage.setItem('token', data.token);
        this.tokenExpirationDate = data.expiration
        localStorage.setItem('tokenExpiration', data.expiration);
        this.isLoggedIn = true;
        return true;
      }));
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.isLoggedIn = false;
  }

}