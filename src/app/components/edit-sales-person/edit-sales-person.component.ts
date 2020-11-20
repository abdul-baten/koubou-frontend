import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SalesmanDetailsService } from '../../services/salesman-details.service';
import { DashboardService } from '../../services/dashboard.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-sales-person',
  templateUrl: './edit-sales-person.component.html',
  styleUrls: ['./edit-sales-person.component.css']
})
export class EditSalesPersonComponent implements OnInit {

  salesMan$: Object;
  id;
  dataValue;
  role: Object;
  companyList: Object;
  jsonObj: any;
  editSalesPerson: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: String;
  birthday;



  gender = ['男', '女'];
  errorMassage = 'Email address already exists';


  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute,
    private cookieService: CookieService, private data: SalesmanDetailsService, private roleData: DashboardService) {

    this.route.params.subscribe(params => this.salesMan$ = params.id);
    this.id = this.salesMan$;

  }

  onSubmit(value) {

    this.submitted = true;
    if (this.editSalesPerson.invalid) {
      return;
    }
    this.loading = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<any>(environment.baseUrl + '/salesman/' + this.id, JSON.stringify(this.editSalesPerson.value), httpOptions)
      .subscribe((res: any) => {
        this.router.navigate(['/salesperson-list']);
      },
      error => {
        this.errorMessage =  'メールアドレスは既に存在します';
        return error;

      });
  }


  ngOnInit() {
    /*this.salesPersonUpdate = false;*/
    this.data.getEditSalesManDetails(this.salesMan$).subscribe(
      data => {
        this.salesMan$ = data;
        this.dataValue = JSON.stringify(this.salesMan$);
        this.jsonObj = JSON.parse(this.dataValue);
        /*birthday = this.dataValue.birthDay;*/
        this.editSalesPerson.get('id').setValue(this.jsonObj.id);
        this.editSalesPerson.get('last_pronunciotion').setValue(this.jsonObj.last_pronunciotion);
        this.editSalesPerson.get('first_pronunciotion').setValue(this.jsonObj.first_pronunciotion);
        this.editSalesPerson.get('last_name').setValue(this.jsonObj.last_name);
        this.editSalesPerson.get('first_name').setValue(this.jsonObj.first_name);
        this.editSalesPerson.get('salse_person_number').setValue(this.jsonObj.salse_person_number);
        this.editSalesPerson.get('email').setValue(this.jsonObj.email);
        this.editSalesPerson.get('phone_number').setValue(this.jsonObj.phone_number);
        this.editSalesPerson.get('birthday').setValue(this.jsonObj.birthday);
        this.editSalesPerson.get('gender').setValue(this.jsonObj.gender);
        this.editSalesPerson.get('role').setValue(this.jsonObj.role);
        this.editSalesPerson.get('team').setValue(this.jsonObj.team);
        this.editSalesPerson.get('remark_1').setValue(this.jsonObj.remark_1);
        this.editSalesPerson.get('remark_2').setValue(this.jsonObj.remark_2);
      }
    );

    this.roleData.getRole().subscribe(
      roleData => this.role = roleData
    );

    this.editSalesPerson = this.formBuilder.group({
      id: '',
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      first_pronunciotion:  ['', Validators.required],
      last_pronunciotion:  ['', Validators.required],
      salse_person_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      birthday: ['', Validators.required],
      gender: '',
      role: '',
      team: '',
      remark_1: '',
      remark_2: ''
    });

  }
  get f() { return this.editSalesPerson.controls; }

}
