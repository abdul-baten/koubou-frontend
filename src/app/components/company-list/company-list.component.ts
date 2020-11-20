import { Component, OnInit } from '@angular/core';
import { CompanyService} from '../../services/company.service';
import {CaseContent} from '../../models/case-content.model';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  companyList$: Object;


  constructor(private data: CompanyService) { }

  ngOnInit() {
    this.data.getCompanyList().subscribe(
      data => this.companyList$ = data
    );
  }
}
