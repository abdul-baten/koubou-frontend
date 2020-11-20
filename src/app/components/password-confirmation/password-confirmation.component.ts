import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { SalesPerson } from '../../models/sales-person';
import { SalesmanDetailsService } from '../../services/salesman-details.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-password-confirmation',
  templateUrl: './password-confirmation.component.html',
  styleUrls: ['./password-confirmation.component.css']
})
export class PasswordConfirmationComponent implements OnInit {
   msg: string = null;
   public newSalesPerson: SalesPerson = new SalesPerson();
   supplierForm: FormGroup;
   supplier$: Object;
   dataValue;
   id;
   email;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute,
              private cookieService: CookieService, private data: SalesmanDetailsService) {
    this.route.params.subscribe(params => this.supplier$ = params.id );
       this.id = this.supplier$;
  }

   ngOnInit() {

     this.data.getSalesManDetails(this.supplier$).subscribe(
     // data => this.company$ = data
      data => {
        this.supplier$ = data;
        this.dataValue = JSON.stringify(this.supplier$);
        var jsonObj = JSON.parse(this.dataValue);
        this.email = jsonObj.email;
     });
  }


    onSubmit() {

      let jsonValue = { "email":this.email, "password":this.newSalesPerson.password };
       const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post<any>(environment.baseUrl + '/update-password/' + this.id, JSON.stringify(jsonValue), httpOptions)
      .subscribe( (res: any) => {
         this.msg = 'パスワードを正常に変更する';
        this.router.navigate(['/login']);
      },
      error => console.log(error));
      this.msg = 'パスワードを正常に変更しないでください';

  }
}
