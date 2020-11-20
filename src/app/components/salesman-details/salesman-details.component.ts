import { Component, OnInit } from '@angular/core';
import { SalesmanDetailsService} from '../../services/salesman-details.service';
import { ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-salesman-details',
  templateUrl: './salesman-details.component.html',
  styleUrls: ['./salesman-details.component.css']
})
export class SalesmanDetailsComponent implements OnInit {

  salesMan$: Object;
  caseInformation$: Object;

  constructor(private router: Router, private route: ActivatedRoute, private data: SalesmanDetailsService,
              private cookieService: CookieService) {
    const name = this.cookieService.get('name');
    const email = this.cookieService.get('email');
    const password = this.cookieService.get('password');
     if (email == "" || email == null && password == "" || password == null) {
       this.router.navigate(['/login']);
     }
    this.route.params.subscribe(params => this.salesMan$ = params.id );

  }

  ngOnInit() {
    this.data.getSalesManDetails(this.salesMan$).subscribe(
      data => this.salesMan$ = data
    );
  }

}
