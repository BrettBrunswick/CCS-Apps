import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/User';

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

  getAllUserRoles(): Observable<string[]> 
  {
    return this.http.get<string[]>(this.rootUrl + '/API/Users/GetAllRoles', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all roles')),
        catchError(this.handleError('getAllUserRoles', []))
    );
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