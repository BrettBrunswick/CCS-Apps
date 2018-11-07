import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/UserLogin';
import { User } from '../models/User';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly rootUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  
  //#region Authentication

  isUserLoggedIn(): boolean
  {
    if ( localStorage.getItem('token') == null || localStorage.getItem('tokenExpiration') == null)
    {
      return false;
    } else {
      return  new Date(localStorage.getItem('tokenExpiration')) > new Date(Date.now());
    }
  }

  getCurrentUser(): string 
  {
    if (localStorage.getItem('username') != null)
    {
      return localStorage.getItem('username');
    } else {
      return 'Unknown';
    }
  }

  login(loginCredentials): Observable<boolean>
  {
    const body: UserLogin = 
    {
      Username: loginCredentials.Username,
      Password: loginCredentials.Password
    }
    return this.http.post(this.rootUrl + '/API/Auth/Login', body)
      .pipe(tap((data: any) => {
        console.log(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiration', data.expiration);
        localStorage.setItem('roles', data.roles);
        localStorage.setItem('username', body.Username);
        return true;
      }));
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
  }

  //#endregion

}
