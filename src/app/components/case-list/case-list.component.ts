import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { PopupService } from '../../services/popup.service';
import { environment } from '../../../environments/environment';

declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CaseContent } from '../../models/case-content.model';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})

export class CaseListComponent implements OnInit, AfterViewInit {

  private changeDetectorRef: ChangeDetectorRef;

  formaD: string = 'yyyy/MM/dd';
  dateNow: Date = new Date();
  dateNowISO = this.dateNow.toISOString();

  confirmDelete = false;
  deleteChecked = false;

  public editBookMark: CaseContent = new CaseContent();
  caseList$: Object;
  salesCaseList$: Object;
  setting$: Object;
  user: Object;
  id;
  checkedList;
  public isLoaded = false;

  constructor(private data: DashboardService, private router: Router, private http: HttpClient, private popupService: PopupService,
              private cookieService: CookieService) {
        const role = this.cookieService.get('role');
        const cid = this.cookieService.get('id');
  }
  role   = this.cookieService.get( 'role');
  cid   = this.cookieService.get( 'id');

  ngAfterViewInit() {

    //this.reloadData();

    this.data.getSetting(this.setting$).subscribe(
      data => {
        this.setting$ = data;
      }
    );
    this.data.getUserDetails(this.cid).subscribe(
      data => this.user = data
    );

    this.data.getCaseList().subscribe(
      data => {
        this.caseList$ = data;
        $(document).ready(function () {
          $('#ngDataTable').DataTable({
            initComplete: function() {
              const registerDate = this.api().column('.registerDate');
              const status = this.api().column('.status');
              const settlementMonth = this.api().column('.settlementMonth');
              const updateDate = this.api().column('.updateDate');
              const representativePersionBirthday = this.api().column('.representativePersionBirthday');

              const projectTitle = this.api().column('.projectTitle');
              const corporateName = this.api().column('.corporateName');
              const location = this.api().column('.location');
              const industry = this.api().column('.industry');
              const representativeName = this.api().column('.representativeName');
              const salesRepresentativeName = this.api().column('.salesRepresentativeName');

              let selectProjectTitle = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#projectTitle')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  projectTitle.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (projectTitle.length > 0) {
                projectTitle.data().unique().sort().each(function(d, j) {
                  selectProjectTitle.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectCorporateName = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#corporateName')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  corporateName.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (corporateName.length > 0) {
                corporateName.data().unique().sort().each(function(d, j) {
                  selectCorporateName.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectLocation = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#location')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  location.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (location.length > 0) {
                location.data().unique().sort().each(function(d, j) {
                  selectLocation.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectindustry = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#industry')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  industry.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (industry.length > 0) {
                industry.data().unique().sort().each(function(d, j) {
                  selectindustry.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectrepresentativeName = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#representativeName')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  representativeName.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (representativeName.length > 0) {
                representativeName.data().unique().sort().each(function(d, j) {
                  selectrepresentativeName.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectsalesRepresentativeName = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#salesRepresentativeName')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  salesRepresentativeName.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (salesRepresentativeName.length > 0) {
                salesRepresentativeName.data().unique().sort().each(function(d, j) {
                  selectsalesRepresentativeName.append('<option value="' + d + '">' + d + '</option>');
                });
              }


              let select = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#registerDate')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  registerDate.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (registerDate.length > 0) {
                registerDate.data().unique().sort().each(function(d, j) {
                  select.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let select2 = $('<select class="form-control mymsel" multiple="multiple"><option value="商談中">商談中</option>' +
                '<option value="商談中断中">商談中断中</option>' +
                '<option value="失注">失注</option>' +
                '<option value="受注">受注</option>' +
                '<option value="失効">失効</option>' +
                '<option value="解約">解約</option></select>')
                .appendTo('#status')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  status.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              let select3 = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#settlementMonth')
                .on('change', function() {

                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  settlementMonth.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (settlementMonth.length > 0) {
                settlementMonth.data().unique().sort().each(function(d, j) {
                  select3.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let select5 = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#updateDate')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  updateDate.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (updateDate.length > 0) {
                updateDate.data().unique().sort().each(function(d, j) {
                  select5.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              const select7 = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#representativePersionBirthday')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  representativePersionBirthday.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (representativePersionBirthday.length > 0) {
                representativePersionBirthday.data().unique().sort().each(function(d, j) {
                  select7.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              $('.mymsel').select2();
              $('#ngDataTable_filter input').click(function () {
                $('.search-box').removeClass('display-none');
              });
              $('#ngDataTable_filter input').append('<span class="search-arrow-icon"></span>');
              $('.btn-search').click(function () {
                $('.search-box').addClass('display-none');
              });
              $(function() {
                $('select option').filter(function(){
                  return ($(this).val().trim()=="" && $(this).text().trim()=="");
                }).remove();
              });

              $('.btn-clear').click(function () {
                $('.mymsel').val(null).trigger('change');
              });
            },
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
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'csv',
                text: 'CSV',
                charset: 'UTF-16BE',
                exportOptions: {
                  columns: [$('.select-filter')]
                },
                bom: true
              },
              {
                extend: 'excel',
                text: 'Excel',
                exportOptions: {
                  columns: [$('.select-filter')]
                }
              },
              {
                extend: 'print',
                text: 'プリント',
                exportOptions: {
                  columns: [$('.select-filter')]
                }
              }
            ],
            'ordering': false
          });
        });

      }
    );

    this.data.getSalesCaseList(this.cid).subscribe(
      data => {
        this.salesCaseList$ = data;
        $(document).ready(function () {
          $('#salesTable').DataTable({
            initComplete: function() {
              const registerDate = this.api().column('.registerDate');
              const status = this.api().column('.status');
              const settlementMonth = this.api().column('.settlementMonth');
              const updateDate = this.api().column('.updateDate');
              const representativePersionBirthday = this.api().column('.representativePersionBirthday');

              const projectTitle = this.api().column('.projectTitle');
              const corporateName = this.api().column('.corporateName');
              const location = this.api().column('.location');
              const industry = this.api().column('.industry');
              const representativeName = this.api().column('.representativeName');
              const salesRepresentativeName = this.api().column('.salesRepresentativeName');

              let selectProjectTitle = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#projectTitle')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  projectTitle.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (projectTitle.length > 0) {
                projectTitle.data().unique().sort().each(function(d, j) {
                  selectProjectTitle.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectCorporateName = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#corporateName')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  corporateName.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (corporateName.length > 0) {
                corporateName.data().unique().sort().each(function(d, j) {
                  selectCorporateName.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectLocation = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#location')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  location.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (location.length > 0) {
                location.data().unique().sort().each(function(d, j) {
                  selectLocation.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectindustry = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#industry')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  industry.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (industry.length > 0) {
                industry.data().unique().sort().each(function(d, j) {
                  selectindustry.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectrepresentativeName = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#representativeName')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  representativeName.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (representativeName.length > 0) {
                representativeName.data().unique().sort().each(function(d, j) {
                  selectrepresentativeName.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let selectsalesRepresentativeName = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#salesRepresentativeName')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  salesRepresentativeName.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (salesRepresentativeName.length > 0) {
                salesRepresentativeName.data().unique().sort().each(function(d, j) {
                  selectsalesRepresentativeName.append('<option value="' + d + '">' + d + '</option>');
                });
              }


              let select = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#registerDate')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  registerDate.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (registerDate.length > 0) {
                registerDate.data().unique().sort().each(function(d, j) {
                  select.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let select2 = $('<select class="form-control mymsel" multiple="multiple"><option value="商談中">商談中</option>' +
                '<option value="商談中断中">商談中断中</option>' +
                '<option value="失注">失注</option>' +
                '<option value="受注">受注</option>' +
                '<option value="失効">失効</option>' +
                '<option value="解約">解約</option></select>')
                .appendTo('#status')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  status.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              let select3 = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#settlementMonth')
                .on('change', function() {

                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  settlementMonth.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (settlementMonth.length > 0) {
                settlementMonth.data().unique().sort().each(function(d, j) {
                  select3.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              let select5 = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#updateDate')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  updateDate.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (updateDate.length > 0) {
                updateDate.data().unique().sort().each(function(d, j) {
                  select5.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              const select7 = $('<select class="form-control mymsel" multiple="multiple"></select>')
                .appendTo('#representativePersionBirthday')
                .on('change', function() {
                  var vals = $('option:selected', this).map(function(index, element) {
                    return $.fn.dataTable.util.escapeRegex($(element).val());
                  }).toArray().join('|');

                  representativePersionBirthday.search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                    .draw();
                });

              if (representativePersionBirthday.length > 0) {
                representativePersionBirthday.data().unique().sort().each(function(d, j) {
                  select7.append('<option value="' + d + '">' + d + '</option>');
                });
              }

              $('.mymsel').select2();
              $('#salesTable_filter input').click(function () {
                $('.search-box').removeClass('display-none');
              });
              /*$('#ngDataTable_filter input').addClass('search-icon');*/
              $('#salesTable_filter input').append('<span class="search-arrow-icon"></span>');
              $('.btn-search').click(function () {
                $('.search-box').addClass('display-none');
              });
              $('.btn-clear').click(function () {
                $('.mymsel').val(null).trigger('change');
              });
            },
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
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'csv',
                text: 'CSV',
                charset: 'UTF-16BE',
                exportOptions: {
                  columns: [$('.select-filter')]
                },
                bom: true
              },
              {
                extend: 'excel',
                text: 'Excel',
                exportOptions: {
                  columns: [$('.select-filter')]
                }
              },
              {
                extend: 'print',
                text: 'プリント',
                exportOptions: {
                  columns: [$('.select-filter')]
                }
              }
            ],
            'ordering': false
          });

        });
      }
    );
  }
  ngOnInit() {

  }

  onCheckboxChange(option, event) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

        })
      };
      this.http.post<any>(environment.baseUrl + '/bookmark/' + option.id + '/' + event.target.checked, event.target.checked, httpOptions)
      .subscribe( (res: any) => {
        console.log(res);
        this.router.navigate(['/case-list']);
      },
      error => console.log(error));

  }

  deleteCase($key, id: any): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    if (confirm('大文字小文字を削除してもよろしいですか？')) {
      this.http.post<any>(environment.baseUrl + '/delete-case/' + id, httpOptions)
        .subscribe((res: any) => {
            window.location.reload();
            this.router.navigate(['/case-list']);
          },
          error => {
            return error;
          });
    }
  }

  onDelete($key, id: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.popupService.openConfirmDialog('案件を削除しますか？')
      .afterClosed().subscribe(res => {
      if (res) {
        this.http.post<any>(environment.baseUrl + '/delete-case/' + id, httpOptions)
          .subscribe((res: any) => {
            window.location.reload();
            //this.reloadData();
          }, error => {
            return error;
          });
      }
    });
  }

  /*reloadData() {
    this.caseList$ = this.data.getCaseList().subscribe(
      data => this.caseList$ = data
    );
  }*/

}
