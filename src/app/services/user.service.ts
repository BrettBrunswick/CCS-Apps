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

  isUserLoggedIn() 
  {
    if ( localStorage.getItem('token') == null || localStorage.getItem('tokenExpiration') == null)
    {
      return false;
    } else {
      return  new Date(localStorage.getItem('tokenExpiration')) > new Date() || localStorage.getItem('token').length > 0;
    }
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiration', data.expiration);
        return true;
      }));
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  }

}
