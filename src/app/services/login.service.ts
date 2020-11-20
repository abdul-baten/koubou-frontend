import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http, private cookieService: CookieService) { }

  sendCredential(email: string, password: string) {

    const url = environment.baseUrl + '/login';
    const encodedCredentials = btoa(email + ':' + password);
    const basicHeader = encodedCredentials;
    const headers = new Headers ({
      'Content-Type' : 'application/json',
      'Authorization' : basicHeader
    });

    return this.http.post(url, {headers: headers});

  }

  checkSession() {
    const url = 'http://18.224.185.169:8181/checkSession';

    const headers = new Headers ({
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers: headers});
  }

  logout() {
    this.cookieService.deleteAll();

  }
}
