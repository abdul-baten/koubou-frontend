import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {SalesPerson} from '../models/sales-person';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class SalesPersonService {

  private url = environment.baseUrl + '/sales-person';
  private urls = environment.baseUrl + '/sales-persons';


  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>(this.url).pipe(
      map(users => {
        const newUsers = [];
        for (const user of users) {
          const email = user.email;
          newUsers.push({email: email});
        }
        return newUsers;
      }),
      tap(users => console.log(users))
    );
  }
  getUsersNumber() {
    return this.http.get<any[]>(this.url).pipe(
      map(users => {
        const newUsers = [];
        for (const user of users) {
          const salse_person_number = user.salse_person_number;
          newUsers.push({salse_person_number: salse_person_number});
        }
        return newUsers;
      }),
      tap(users => console.log(users))
    );
  }

  getUsersByEmail(email: string) {
    return this.http.get<any[]>(`${this.url}/${email}`);
  }

  getUsersByNumber(salse_person_number: string) {
    return this.http.get<any[]>(`${this.urls}/${salse_person_number}`);
  }

   sendSalesPerson(salesPerson: SalesPerson) {
     const httpOptions = {
       headers: new HttpHeaders({
         'Accept': 'application/json'
       })
     };
     const url = environment.baseUrl + '0/sales-person';

    return this.http.post(url, httpOptions);
  }

}
