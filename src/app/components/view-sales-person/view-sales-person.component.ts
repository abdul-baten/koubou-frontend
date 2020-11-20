import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import { SalesPerson } from '../../models/sales-person';
import {SalesPersonService} from '../../services/sales-person.service';
import { PopupService } from '../../services/popup.service';
import { environment } from '../../../environments/environment';

declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-view-sales-person',
  templateUrl: './view-sales-person.component.html',
  styleUrls: ['./view-sales-person.component.css']
})
export class ViewSalesPersonComponent implements OnInit, AfterViewInit {
  loading = false;
  submitted = false;
  errorMessage: String;
  successMessage: string;
  private salesPersons: SalesPerson[];
  sales$: Object;

  constructor(private router: Router, private salesPersonService: SalesPersonService, private http: HttpClient,
              private cookieService: CookieService, private popupService: PopupService) {
       const id = this.cookieService.get('id');
       const name = this.cookieService.get('name');
       const email = this.cookieService.get('email');
       const password = this.cookieService.get('password');
       if (email == '' || email == null && password == '' || password == null) {
         this.router.navigate(['/login']);
       }
   }

   userId = this.cookieService.get('id');
   id = this.cookieService.get('id');
   name = this.cookieService.get('name');
   email = this.cookieService.get('email');
   role = this.cookieService.get('role');

   deleteSalesman($key, id: any): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
     this.popupService.openConfirmDialog('営業担当者を削除しますか？')
       .afterClosed().subscribe(res => {
       if (res) {
         this.http.post<any>(environment.baseUrl + '/delete-salesperson/' + id, httpOptions)
           .subscribe((res: any) => {
             window.location.reload();
             this.router.navigate(['/salesperson-list']);
           }, error => {
             this.errorMessage =  'メールアドレスは既に存在します';
             return error;
           });
       }
     });
  }

  ngAfterViewInit() {
    this.http.get(environment.baseUrl + '/sales-person').subscribe(data => this.sales$ = data);

    this.http.get(environment.baseUrl + '/sales-person').subscribe(
      data => {
        this.sales$ = data;
        $(document).ready(function () {
          $('#salesPerson').DataTable({
            'language': {
              'emptyTable': '表示できる案件がありません',
              'search': '検索',
              'info': '_TOTAL_ 件中 _START_ ~ _END_ 件表示',
              'zeroRecords': '該当する案件が見つかりません',
              'infoFiltered': '(登録件数 _MAX_ 件をフィルターにかけました)',
              'infoEmpty': '0件中 0 ~ 0件表示',
              'paginate': {
                'previous': '前へ',
                'next': '次へ'
              }
            },
            'bLengthChange': false,
            'searching': false
          });

        });

      }
    );
  }

  ngOnInit() {

  }

}
