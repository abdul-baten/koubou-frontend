import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
declare var $: any;
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
startDate = new Date(1990, 0, 1);
  survey: FormGroup;
  company$: Object;
  id;
  companyName;
  dataValue;
  jsonObj: any;
  orderForm: FormGroup;
  items: FormArray;
  supplier: FormArray;
  loading = false;
  submitted = false;


  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder) {

  }

  ngOnInit() {

    this.orderForm = this.formBuilder.group({
      company_name: ['', Validators.required],
      id: '',
      location:  ['', Validators.required],
      phone_number: '',
      website_link: '',
      supplier: this.formBuilder.array([])
    });
    this.addItem();

  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }

  }

  stopEnter(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  }

  get f() { return this.orderForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }
    this.loading = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post<any>(environment.baseUrl + '/create-company', JSON.stringify(this.orderForm.value), httpOptions)
      .subscribe( (res: any) => {
          console.log(res);
          this.router.navigate(['/company-information/1']);
        },
        error => console.log(error));



  }


  createItems(): FormGroup {
    return this.formBuilder.group({
      id: '',
      subCompanyName: '',
      departmentName: '',
      location: '',
      phone: '',
      representativeInCharge: '',
    });
  }
  createItem(val: any): FormGroup {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      subCompanyName: val != null ? val.subCompanyName : '',
      departmentName: val != null ? val.departmentName : '',
      location: val != null ? val.location : '',
      phone: val != null ? val.phone : '',
      representativeInCharge: val != null ? val.representativeInCharge : '',
    });
  }

  addItem(): void {
    this.supplier = this.orderForm.get('supplier') as FormArray;
    this.supplier.push(this.createItems());
  }

  removedItem(index: any): void {
    this.supplier = this.orderForm.get('supplier') as FormArray;
    if (index > 1) {
      this.supplier.removeAt(index - 1);
    }
  }

}
