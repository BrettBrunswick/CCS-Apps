import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/UserLogin';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly rootUrl = 'https://ccsappsapi.azurewebsites.net';

  constructor(private http: HttpClient, private router: Router) { }

  
  //#region Authentication

  isUserLoggedIn(): boolean
  {
    var result;
    if ( localStorage.getItem('token') == null || localStorage.getItem('tokenExpiration') == null)
    {
      result = false;
    } else {
      result = new Date(localStorage.getItem('tokenExpiration')) > new Date(Date.now());
    }

    if (!result)
    {
      this.logout();
    }

    return result;
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
    if (this.router.url != '/login')
    {
      this.router.navigate(['/login']);
    }
  }

  //#endregion
}
