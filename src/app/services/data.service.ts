import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { NewUser } from '../models/NewUser';
import { EditUser } from '../models/EditUser';
import { SubContractor } from '../models/SubContractor';
import { SubContractorList } from '../models/SubContractorList';
import { Trade } from '../models/Trade';
import { Location } from 'src/app/models/Location';
import { SubContractorSearchRequest } from 'src/app/models/SubContractorSearchRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly rootUrl = environment.apiRootURL;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders
  {
    return new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + localStorage.getItem("token"));
  }

  //#region Helpers

  isBlankOrNull(str: string)
  {
      return (!str || /^\s*$/.test(str));
  }

  //#endregion
  
  
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
    const body: NewUser = 
    {
      Username: newUser.Username,
      Password: newUser.Password,
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


  //#region SubContractors
  
  getAllSubs(): Observable<SubContractor[]> 
  {
    return this.http.get<SubContractor[]>(this.rootUrl + '/API/SubContractors', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all subs')),
        catchError(this.handleError('getAllSubs', []))
    );
  }

  getRandomSubs(batchSize: number): Observable<SubContractor[]> 
  {
    return this.http.get<SubContractor[]>(this.rootUrl + '/API/SubContractors/Random/' + batchSize, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched random subs')),
        catchError(this.handleError('getRandomSubs', []))
    );
  }

  getSubById(id: number): Observable<SubContractor[]> 
  {
    return this.http.get<SubContractor[]>(this.rootUrl + '/API/SubContractors/' + id, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched sub id: ' + id)),
        catchError(this.handleError('getSubById', []))
    );
  }

  getSimilarSubsById(id: number): Observable<SubContractor[]> 
  {
    return this.http.get<SubContractor[]>(this.rootUrl + '/API/SubContractors/Similar/' + id, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched similar subs for sub: ' + id)),
        catchError(this.handleError('getSimilarSubsById', []))
    );
  }

  searchSubs(request?: SubContractorSearchRequest): Observable<SubContractor[]> 
  {
    var companyNameParam = !this.isBlankOrNull(request.CompanyName) ? 'companyName=' + request.CompanyName.trim() : '';
    var cityParam = !this.isBlankOrNull(request.City) ? '&city=' + request.City.trim()  : '';
    var stateParam = !this.isBlankOrNull(request.State) && request.State.indexOf(' ') < 0 ? '&state=' + request.State : '';
    var zipCodeParam = !this.isBlankOrNull(request.ZipCode) ? '&zipCode=' + request.ZipCode.trim()  : '';
    var tradesParam = request.TradeIds != undefined ? this.getTradesParamFromArray(request.TradeIds) : '';
    var radiusParam = request.Radius != undefined && request.Radius != null ? '&radius=' + request.Radius : '';

    var searchString = companyNameParam + cityParam + stateParam + zipCodeParam + tradesParam + radiusParam;
    console.log('/API/SubContractors/Search?' + searchString);

    return this.http.get<SubContractor[]>(this.rootUrl + '/API/SubContractors/Search?' + searchString, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('searched subs')),
        catchError(this.handleError('searchSubs', []))
    );
  }

  editSubContractor(subContractor, subId: number)
  {
    console.log(subContractor);
    const body = 
    {
      SubId: subId,
      Name: subContractor.editSubName,
      AddressLine1: subContractor.editSubAddress1,
      AddressLine2: subContractor.editSubAddress2,
      State: subContractor.State,
      City: subContractor.editSubCity,     
      ZipCode: subContractor.editSubZipCode,
      WebsiteURL: subContractor.editSubWebsite,
      OfficePhone: subContractor.editSubPhone,
      OfficeFax: subContractor.editSubFax,
      OfficeEmail: subContractor.editSubEmail,
      TradeId: subContractor.Trade.id,
    }
    console.log(body);
    return this.http.post(this.rootUrl + '/API/SubContractors/Edit', body, {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  getTradesParamFromArray(arr: number[])
  {
    let result: string = '';
    arr.forEach(element => {
      result += '&tradeIds=' + element.valueOf();
    });
    return result;
  }

  getAllTrades(): Observable<Trade[]> 
  {
    return this.http.get<Trade[]>(this.rootUrl + '/API/Trades/GetAll', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all trades')),
        catchError(this.handleError('getAllTrades', []))
    );
  }

  getAllStates(): Observable<string[]> 
  {
    return this.http.get<string[]>(this.rootUrl + '/API/SubContractors/GetAllStates', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all states')),
        catchError(this.handleError('getAllStates', []))
    );
  }

  //#endregion
  

  //#region SubContractorLists

  getAllSubLists(): Observable<SubContractorList[]>
  {
    return this.http.get<SubContractorList[]>(this.rootUrl + '/API/SubContractorLists/GetAllSubContractorLists', {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all sub lists')),
        catchError(this.handleError('getAllSubs', []))
    );
  }

  getSubListById(id: number): Observable<SubContractorList[]>
  {
    return this.http.get<SubContractorList[]>(this.rootUrl + '/API/SubContractorLists/' + id, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched sub list')),
        catchError(this.handleError('getSubListById', []))
    );
  }

  getAllSubListsBySub(subId: number): Observable<SubContractorList[]>
  {
    return this.http.get<SubContractorList[]>(this.rootUrl + '/API/SubContractorLists/GetBySub/' + subId, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched all sub lists for sub')),
        catchError(this.handleError('getAllSubListsBySub', []))
    );
  }

  createSubContractorList(newList: any): Observable<string[]>
  {
    const body = 
    {
      Name: newList.name,
      Description: newList.description,
      CreatedByUsername: localStorage.getItem('username'),
      SubContractorIds: []
    };
    return this.http.post<string[]>(this.rootUrl + '/API/SubContractorLists/Create', body, {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  addSubToList(listId: number, subId: number): Observable<string[]>
  {
    const body = 
    {
      ListId: listId,
      SubId: subId
    };
    return this.http.post<string[]>(this.rootUrl + '/API/SubContractorLists/AddSub', body, {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  deleteSubFromList(listId: number, subId: number): Observable<string[]>
  {
    const body = 
    {
      ListId: listId,
      SubId: subId
    };
    return this.http.post<string[]>(this.rootUrl + '/API/SubContractorLists/DeleteSub', body, {headers: this.getHeaders()})
      .pipe(tap((data: any) => {
        console.log(data);
        return true;
      }));
  }

  deleteSubList(listId: number): Observable<void[]>
  {
    return this.http.delete<void[]>(this.rootUrl + '/API/SubContractorLists/' + listId, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('deleted list')),
        catchError(this.handleError('deleteSubList', []))
    );
  }

  //#endregion


  //#region Locations

  getLocationByZip(zipCode: string): Observable<Location[]>
  {
    return this.http.get<Location[]>(this.rootUrl + '/API/Locations/GetByZip?zipcode=' + zipCode, {headers: this.getHeaders()})
      .pipe(
        tap(_ => console.log('fetched location')),
        catchError(this.handleError('getLocationByZip', []))
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