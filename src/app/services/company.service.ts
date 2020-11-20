import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanyList() {
    return this.http.get(environment.baseUrl + '/company-list');
  }

  getCompanyDetails(id) {
    return this.http.get(environment.baseUrl + '/company/' + 1);
  }

  getSetting(id) {
    return this.http.get(environment.baseUrl + '/setting/' + 1);
  }

}
