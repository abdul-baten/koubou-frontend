import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css']
})
export class EditSupplierComponent implements OnInit {
 supplierForm: FormGroup;
  supplier$: Object;
  dataValue;
  id;
  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private data: SupplierService) {
 	this.route.params.subscribe(params => this.supplier$ = params.id );
       this.id = this.supplier$;
   }



   onSubmit() {
       var jsonObj = JSON.parse(this.dataValue);
       const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };


       this.http.post<any>(environment.baseUrl + '/supplier/'+jsonObj, JSON.stringify(this.supplierForm.value), httpOptions)
      .subscribe( (res: any) => {
        this.router.navigate(['/company-list']);
      },
      error => console.log(error));

  }

   ngOnInit() {
     this.data.getSupplierDetails(this.supplier$).subscribe(
      data => this.supplier$ = data
      );
      this.dataValue = JSON.stringify(this.supplier$);
      var jsonObj = JSON.parse(this.dataValue);

     this.supplierForm = new FormGroup({
      supplayerId: new FormControl(''),
      subCompanyName: new FormControl(''),
      departmentName: new FormControl(''),
      location: new FormControl(''),
      phone: new FormControl(''),
      representativeInCharge: new FormControl('')
    });

  }


}
