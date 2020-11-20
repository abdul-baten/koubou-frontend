import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor(private http: HttpClient) { }


  getCaseDetails(id) {
    return this.http.get(environment.baseUrl + '/case-details/' + id);
  }

}
