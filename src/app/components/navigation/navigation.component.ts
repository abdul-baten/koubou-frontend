import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService) {
    let id = this.cookieService.get('id');
	  let name = this.cookieService.get('name');
  	let email = this.cookieService.get('email');
  	let password = this.cookieService.get('password');
    let  role   = this.cookieService.get( 'role');
    let company_id = this.cookieService.get("company_id");

  	if (email == "" && email == null && password == "" && password == null) {
  		 this.router.navigate(['/login']);
  	}
   }

  id     = this.cookieService.get('id');
  name   = this.cookieService.get('name');
  email  = this.cookieService.get('email');
  role   = this.cookieService.get( 'role');
  company_id = this.cookieService.get('company_id');

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
