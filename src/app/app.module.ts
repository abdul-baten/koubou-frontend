import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import { routing } from './app.routing';
import { HttpModule } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

import { AddBookService } from './services/add-book.service';
import { SalesPersonService } from './services/sales-person.service';
import { LoginService} from './services/login.service';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SalesPersonComponent } from './components/sales-person/sales-person.component';
import { CompanyComponent } from './components/company/company.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ViewSalesPersonComponent } from './components/view-sales-person/view-sales-person.component';
import { SalesmanDetailsComponent } from './components/salesman-details/salesman-details.component';

import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';

import { EditSalesPersonComponent } from './components/edit-sales-person/edit-sales-person.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { EditCaseComponent } from './components/edit-case/edit-case.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { EditSupplierComponent } from './components/edit-supplier/edit-supplier.component';
import { EditCompanyInfoComponent } from './components/edit-company-info/edit-company-info.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PasswordConfirmationComponent } from './components/password-confirmation/password-confirmation.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { SettingComponent } from './components/setting/setting.component';
import { UpdateCompanyComponent } from './components/update-company/update-company.component';
import { CasesComponent } from './components/cases/cases.component';
import { UpdateCaseComponent } from './components/update-case/update-case.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/*import { TextareaAutosizeModule } from 'ngx-textarea-autosize';*/
import {AutosizeModule} from 'ngx-autosize';
import {MatButtonModule} from '@angular/material/button';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UniqueEmailValidatorDirective } from './services/shared/unique-email-validator.directive';
import { UniqueNumberValidatorDirective } from './services/shared/unique-number-validator.directive';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material';


/*'./services/add-book.service';*/

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SalesPersonComponent,
    CompanyComponent,
    DashboardComponent,
    LoginComponent,
    ViewSalesPersonComponent,
    SalesmanDetailsComponent,

    CompanyListComponent,
    CompanyDetailsComponent,
    EditSalesPersonComponent,
    SuppliersComponent,
    EditCaseComponent,
    EditCompanyComponent,
    EditSupplierComponent,
    EditCompanyInfoComponent,
    ResetPasswordComponent,
    PasswordConfirmationComponent,
    CaseListComponent,
    SettingComponent,
    UpdateCompanyComponent,
    CasesComponent,
    UpdateCaseComponent,
    MatConfirmDialogComponent,
    UniqueEmailValidatorDirective,
    UniqueNumberValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AutosizeModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    BrowserAnimationsModule,
    routing,
    NgbModule,
    HttpModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    /* BsDatepickerModule.forRoot()
   RouterModule.forRoot([

      {path: "", component: DashboardComponent},
      {path: "sales", component: SalesPersonComponent },
      {path: "company", component: CompanyComponent},
      {path: "book", component: AddNewBookComponent},
      ]
      )*/
  ],
  providers: [
  AddBookService,
  SalesPersonService,
  LoginService,
  CookieService
  ],
  bootstrap: [AppComponent],
  entryComponents: [MatConfirmDialogComponent]
})
export class AppModule {

  public static PLAY_API: 'http://localhost:9000';
  angularUrl: 'http://localhost:4200';

}

