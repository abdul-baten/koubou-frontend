import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {

  survey: FormGroup;
  company$: Object;
  id;
  companyName;
  dataValue;
  jsonObj: any;
  orderForm: FormGroup;
  items: FormArray;
  supplier: FormArray;
  supplierLength;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute,
              private cookieService: CookieService, private data: CompanyService) {
    this.route.params.subscribe(params => {this.company$ = params.id; console.log(this.company$, 'id'); } );
    this.id = this.company$;

    let role = this.cookieService.get('role');
  }
  role   = this.cookieService.get( 'role');

  ngOnInit() {
    this.data.getCompanyDetails(this.company$).subscribe(
      data => {
        this.company$ = data;
        this.dataValue = JSON.stringify(this.company$);
        this.jsonObj = JSON.parse(this.dataValue);
        this.supplierLength = this.jsonObj.supplier.length;

       this.orderForm.get('company_name').setValue(this.jsonObj.company_name);
       this.orderForm.get('location').setValue(this.jsonObj.location);
       this.orderForm.get('phone_number').setValue(this.jsonObj.phone_number);
       this.orderForm.get('website_link').setValue(this.jsonObj.website_link);

        let supplier = this.orderForm.get("supplier") as FormArray;
        for (let i =0 ; i < this.jsonObj.supplier.length; i++) {
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
    this.addItem();

  }

  onSubmit() {

    var jsonObj = JSON.parse(this.dataValue);
    var companyId = jsonObj.id;
    var companyName = jsonObj.company_name;
    var location = jsonObj.location;
    var suppliers = jsonObj.supplier.length;

    for (var i = 0; i < suppliers; ++i) {
      var supplierId 	=jsonObj.supplier[i].id;
      var companyName =jsonObj.supplier[i].subCompanyName;
      var supplierId 	=jsonObj.supplier[i].location;
      var supplierId 	=jsonObj.supplier[i].phone;
      var supplierId 	=jsonObj.supplier[i].representativeInCharge;
    }



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

  addItem(): void {
    this.supplier = this.orderForm.get('supplier') as FormArray;
  }


}
