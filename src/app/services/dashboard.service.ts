import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getCaseList() {
    return this.http.get(environment.baseUrl + '/case-list');
  }
  getSalesCaseList(id) {
    return this.http.get(environment.baseUrl + '/case-list/' + id);
  }

  getRole() {
    return this.http.get(environment.baseUrl + '/get-role');
  }

  getSetting(id) {
    return this.http.get(environment.baseUrl + '/setting/' + 1);
  }

  getBookmaekCaseList() {
    return this.http.get(environment.baseUrl + '/bookmark-case-list');
  }
  getUserDetails(id) {
    return this.http.get(environment.baseUrl + '/salesman/' + id);
  }
  getSalespersonCaseList(id) {
    return this.http.get(environment.baseUrl + '/bookmark-case-list/' + id);
  }
}
