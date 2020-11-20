import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesmanDetailsService {

  constructor(private http: HttpClient) { }

  getSalesManDetails(id) {
    return this.http.get(environment.baseUrl + '/salesman/' + id);
  }
  getEditSalesManDetails(id) {
    return this.http.get(environment.baseUrl + '/salesmans/' + id);
  }
}
