import { Component, OnInit, AfterViewInit, ElementRef, Directive } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, NG_ASYNC_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { SalesPersonService } from '../../services/sales-person.service';
import { DashboardService } from '../../services/dashboard.service';
import { uniqueEmailValidator } from '../../services/shared/unique-email-validator.directive';
import { uniqueNumberValidator } from '../../services/shared/unique-number-validator.directive';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.css'],
})

export class SalesPersonComponent implements OnInit, AfterViewInit {

  role: Object;
  companyList: Object;

  jsonObj: any;
  salesPersonForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: String;

  gender = ['男', '女'];

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private elementRef: ElementRef,
    private salesPersonService: SalesPersonService, private cookieService: CookieService, private data: DashboardService) {
    const name = this.cookieService.get('name');
    const email = this.cookieService.get('email');
    const password = this.cookieService.get('password');

  }

      ngOnInit() {

        this.salesPersonForm = this.formBuilder.group({
          id: '',
          first_pronunciotion: ['', [Validators.required, Validators.pattern('[\u30A0-\u30FF\. ]+')]],
          last_pronunciotion: ['', [Validators.required, Validators.pattern('[\u30A0-\u30FF\. ]+')]],
          first_name: ['', Validators.required],
          last_name: ['', Validators.required],
          salse_person_number: ['', [Validators.required], uniqueNumberValidator(this.salesPersonService)],
          email: ['', [Validators.required, Validators.email], uniqueEmailValidator(this.salesPersonService)],
          phone_number: ['', Validators.required],
          birthday: ['', Validators.required],
          team: '',
          gender: '',
          role: '',
          remark_1: '',
          remark_2: '',
          password: this.makeid()
        });

        this.data.getRole().subscribe(
          data => this.role = data
        );
        this.salesPersonService.getUsers().subscribe();
        this.salesPersonService.getUsersNumber().subscribe();


      }
      get f() { return this.salesPersonForm.controls; }


  onSubmit() {

    this.submitted = true;
    if (this.salesPersonForm.invalid) {
      return;
    }
    this.loading = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<any>(environment.baseUrl + '/sales', JSON.stringify(this.salesPersonForm.value), httpOptions)
      .subscribe((res: any) => {
        this.router.navigate(['/salesperson-list']);
      },
        error => {
          this.errorMessage =  'メールアドレスは既に存在します';
          return error;

        }
      );

  }


  makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


ngAfterViewInit() {
  this.elementRef.nativeElement.focus();
   const n = Math.random().toString(36).substring(6);
  this.makeid();
}


}
