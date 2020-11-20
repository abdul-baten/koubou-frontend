import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { DashboardService} from '../../services/dashboard.service';
declare var $: any;

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  caseList$: Object;
  user: Object;
  salesPersonCaseList$: Object;


  constructor(private router: Router, private cookieService: CookieService, private data: DashboardService) {
    const id = this.cookieService.get('id');
    const name = this.cookieService.get('name');
    const email = this.cookieService.get('email');
    const password = this.cookieService.get('password');
    const role = this.cookieService.get('role');

    const salse_person_number = this.cookieService.get('salse_person_number');

    if (email === '' && email == null && password === '' && password == null) {
      this.router.navigate(['/login']);
    }
    if (role === '' || role == null) {
      this.router.navigate(['/login']);
    }
    console.log('Role is ' + role);
  }

  name   = this.cookieService.get('name');
  email  = this.cookieService.get('email');
  team   = this.cookieService.get( 'team');
  id     = this.cookieService.get( 'id');
  role   = this.cookieService.get( 'role');

  salse_person_number = this.cookieService.get( 'salse_person_number');


  ngOnInit() {
    this.data.getBookmaekCaseList().subscribe(
      data => this.caseList$ = data
    );
    this.data.getSalespersonCaseList(this.id).subscribe(
      data => this.salesPersonCaseList$ = data
    );

    this.data.getUserDetails(this.id).subscribe(
      data => this.user = data
    );
  }
}
