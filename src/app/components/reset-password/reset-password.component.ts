import { Component, OnInit } from '@angular/core';

import { ResetPassword } from '../../models/reset-password';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SalesPerson } from '../../models/sales-person';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
 public newSalesPerson: SalesPerson = new SalesPerson();
 msg: string = null;
  errorMessage: string  = '';

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private cookieService: CookieService) { }
  resetPassword = new ResetPassword('');

  ngOnInit() {
  }


  onSubmit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<any>(environment.baseUrl + '/reset-password', JSON.stringify(this.newSalesPerson), httpOptions)
      .subscribe( (res: any) => {

           if (res == null ) {
            this.errorMessage = 'インビルド 電子メールアドレス';
            this.router.navigate(['/reset-password']);
           }
          console.log(res);
          this.msg = 'あなたのメールアドレスを確認してください';
         // this.router.navigate(['/update-password']);
        },
        error => console.log(error));
        this.router.navigate(['/reset-password']);
        this.msg = 'Invilade email address';

  }

}
