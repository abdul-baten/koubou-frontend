import { Component, OnInit } from '@angular/core';
import {CompanyService} from '../../services/company.service';
import { Supplier} from '../../models/supplier';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  companyList$: Object;

  constructor(private data: CompanyService, private http: HttpClient, private formBuilder: FormBuilder, private router: Router) {}
  supplier = new Supplier(1, '', '', '', '');


  ngOnInit() {
    this.data.getCompanyList().subscribe(
      data => this.companyList$ = data
    );
  }

  onSubmit() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<any>(environment.baseUrl + '/create-supplier', JSON.stringify(this.supplier), httpOptions)
      .subscribe( (res: any) => {
          this.router.navigate(['/dashboard']);
        },
        error => console.log(error));
  }


}
