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
  selector: 'app-edit-company-info',
  templateUrl: './edit-company-info.component.html',
  styleUrls: ['./edit-company-info.component.css']
})
export class EditCompanyInfoComponent implements OnInit {
	companyForm: FormGroup;
    company$: Object;
    id;
    dataValue;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private data: CompanyService) {
		this.route.params.subscribe(params => {this.company$ = params.id; console.log(this.company$, "id")} );
       	this.id = this.company$;
   }

  ngOnInit() {
  	this.companyForm = new FormGroup({
      company_name: new FormControl(''),
      location: new FormControl(''),
      phone_number: new FormControl(''),
      website_link: new FormControl('')
    });

     this.data.getCompanyDetails(this.company$).subscribe(
      data => {
      	this.company$ = data;
      	this.dataValue = JSON.stringify(this.company$);
      	var jsonObj = JSON.parse(this.dataValue);
   }
    );
  }
  onSubmit() {
   var jsonObj = JSON.parse(this.dataValue);
    var companyId = jsonObj.id;
     const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

       this.http.post<any>(environment.baseUrl + '/company/' + companyId, JSON.stringify(this.companyForm.value), httpOptions)
      .subscribe( (res: any) => {
        this.router.navigate(['/company-list']);
      },
      error=> console.log(error));
  }

}
