import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.css']
})
export class UpdateCompanyComponent implements OnInit {

  survey: FormGroup;
  company$: Object;
  id;
  companyName;
  dataValue;
  jsonObj: any;
  orderForm: FormGroup;
  items: FormArray;
  supplier: FormArray;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute,
              private cookieService: CookieService, private data: CompanyService) {
    this.route.params.subscribe(params => {this.company$ = params.id; } );
    this.id = this.company$;
   }

  ngOnInit() {
    this.data.getCompanyDetails(this.company$).subscribe(
      data => {
        this.company$ = data;
        this.dataValue = JSON.stringify(this.company$);
        this.jsonObj = JSON.parse(this.dataValue);
        this.orderForm.get('company_name').setValue(this.jsonObj.company_name);
        this.orderForm.get('location').setValue(this.jsonObj.location);
        this.orderForm.get('phone_number').setValue(this.jsonObj.phone_number);
        this.orderForm.get('website_link').setValue(this.jsonObj.website_link);

        let supplier = this.orderForm.get('supplier') as FormArray;
        for (let i = 0 ; i < this.jsonObj.supplier.length; i++) {
              supplier.push(this.createItem(this.jsonObj.supplier[i]));
        }

       });

      this.orderForm = this.formBuilder.group({
        company_name: '',
        id: '',
        location: '',
        phone_number: '',
        website_link: '',
        supplier: this.formBuilder.array([])
     });

  }
  stopEnter(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  }


   onSubmit() {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
            })
          };
          this.http.post<any>(environment.baseUrl + '/update-company/' + this.id, JSON.stringify(this.orderForm.value), httpOptions)
          .subscribe( (res: any) => {
            console.log(res);
            this.router.navigate(['/company-information/1']);
          },
          error => console.log(error));
  }


  createItems(): FormGroup {
    return this.formBuilder.group({
      id: '',
      subCompanyName: '' ,
      departmentName: '',
      location: '',
      phone: '',
      representativeInCharge: '',
    });
  }
  createItem(val : any): FormGroup {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      subCompanyName: val != null ? val.subCompanyName : '',
      departmentName: val != null ? val.departmentName : '',
      location: val != null ? val.location : '',
      phone: val != null ? val.phone : '',
      representativeInCharge: val != null ? val.representativeInCharge : '',
    });
  }

  addSupplier(index: any): void {
    this.supplier = this.orderForm.get('supplier') as FormArray;
    this.supplier.push(this.createItems());
  }

  removeSupplier(index: any): void {
    this.supplier = this.orderForm.get('supplier') as FormArray;
      this.supplier.removeAt(index);
      console.log(index);
  }

  removedItem(index: any): void {
    this.supplier = this.orderForm.get('supplier') as FormArray;
    if (index > 1) {
      this.supplier.removeAt(index - 1);
    }
  }

}
