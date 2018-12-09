import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { NewUser } from '../models/NewUser';
import { EditUser } from '../models/EditUser';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly rootUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders
  {
    return new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + localStorage.getItem("token"));
  }

  
  
  //#region User Data

  getAllUsers(): Observable<User[]> 
  {
    return this.http.get<User[]>(this.rootUrl + '/API/Users/GetAll', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all users')),
        catchError(this.handleError('getAllUsers', []))
    );
  }

  getUserByUsername(username: string): Observable<User[]> 
  {
    return this.http.get<User[]>(this.rootUrl + '/API/Users/' + username, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched' + username)),
        catchError(this.handleError('getUserByUsername', []))
    );
  }

  getAllUserRoles(): Observable<string[]> 
  {
    return this.http.get<string[]>(this.rootUrl + '/API/Users/GetAllRoles', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all roles')),
        catchError(this.handleError('getAllUserRoles', []))
    );
  }

  registerUser(newUser: NewUser): Observable<boolean>
  {
    console.log("IsAdmin: " + newUser.IsAdmin);
    const body: NewUser = 
    {
      Username: newUser.Username,
      Password: newUser.Password,
      Email: newUser.Email,
      FirstName: newUser.FirstName,
      LastName: newUser.LastName,
      IsAdmin: newUser.IsAdmin
    }
    return this.http.post(this.rootUrl + '/API/Auth/Register', body, {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  editUser(editUser: EditUser)
  {
    const body: EditUser = 
    {
      Username: editUser.Username,
      IsAdmin: editUser.IsAdmin,
      NewPassword: editUser.NewPassword == undefined ? "" : editUser.NewPassword
    }
    console.log(body);
    return this.http.post(this.rootUrl + '/API/Users/EditUser', body, {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  deleteUser(userName: string)
  {
    return this.http.post(this.rootUrl + '/API/Users/DeleteUser', '"' + userName + '"', {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  //#endregion


  

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}