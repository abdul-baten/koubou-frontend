import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';



import { SalesPerson } from '../../models/sales-person';
import {SalesPersonService} from '../../services/sales-person.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   cookieValue = 'UNKNOWN';

  private loginForm: SalesPerson = new SalesPerson();
  private salesPersonAdded: boolean;

 errorMessage: string  = '';
 private credential = {'email': '', 'password' : ''};
 private loggedIn = false;
// loginForm: FormGroup;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private loginService: LoginService,
              private cookieService: CookieService) {
    const role = this.cookieService.get('role');

    if (role === '1' || role === '2') {
      this.router.navigate(['/dashboard']);
    }
  }


  formSubmit() {
    if (this.loginForm.remember == true) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post<any>(environment.baseUrl + '/login', JSON.stringify(this.loginForm), httpOptions)
        .subscribe( (res: any) => {

            this.cookieService.set( 'id', res.id, 14);
            this.cookieService.set( 'name', res.last_name + ' ' + res.first_name , 14);
            this.cookieService.set('last_name', res.last_name, 14);
            this.cookieService.set( 'email', res.email, 14 );
            this.cookieService.set( 'password', res.password, 14 );
            this.cookieService.set( 'role', res.role, .01 );

            const userId    = this.cookieService.get('id');
            const name      = this.cookieService.get('name');
            const email     = this.cookieService.get('email');
            const password  = this.cookieService.get('password');
            const role      = this.cookieService.get('role');
            this.router.navigate(['/dashboard']);
          },
          error => console.log(error));
      setTimeout(() => {
        this.errorMessage = 'ユーザー名かパスワードが間違っています';
      }, 1000);
      this.router.navigate(['/login']);
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post<any>(environment.baseUrl + '/login', JSON.stringify(this.loginForm), httpOptions)
        .subscribe( (res: any) => {

            this.cookieService.set( 'id', res.id);
            this.cookieService.set( 'name', res.last_name + ' ' + res.first_name );
            this.cookieService.set('last_name', res.last_name);
            this.cookieService.set( 'email', res.email );
            this.cookieService.set( 'password', res.password);
            this.cookieService.set( 'role', res.role);

            const userId    = this.cookieService.get('id');
            const name      = this.cookieService.get('name');
            const email     = this.cookieService.get('email');
            const password  = this.cookieService.get('password');
            const role      = this.cookieService.get('role');

            this.router.navigate(['/dashboard']);
          },
          error => console.log(error));

      this.router.navigate(['/login']);
     setTimeout(() => {
        this.errorMessage = 'ユーザー名かパスワードが間違っています';
      }, 1000);
      /*this.errorMessage = 'ユーザー名かパスワードが間違っています';*/
    }

  }

  ngOnInit() {
     this.loginService.logout();
     this.salesPersonAdded = false;
    }
  }



