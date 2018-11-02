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

  constructor(private http: HttpClient) { }

  private token: string = '';
  private tokenExpirationDate : Date;
  private isLoggedIn = false;

  isUserLoggedIn() 
  {
    return this.isLoggedIn;
  }

  public get loginRequired(): boolean
  {
    return this.token.length == 0 || this.tokenExpirationDate > new Date();
  }

  login(creds): Observable<boolean>
  {
    const body: UserLogin = 
    {
      Username: creds.Username,
      Password: creds.Password
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
