import { Component, OnInit } from '@angular/core';
import { CompanyService} from '../../services/company.service';
import {ActivatedRoute} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  company$: Object;
  suppliers$: Object;

  constructor(private router: Router, private route: ActivatedRoute, private data: CompanyService, private http: HttpClient) {
    this.route.params.subscribe(params => {this.company$ = params.id; } );
  }

  ngOnInit() {
    this.data.getCompanyDetails(this.company$).subscribe(
      data => {this.company$ = data; }
    );
  }


}
