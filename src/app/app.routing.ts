import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { CompanyComponent } from './components/company/company.component';
import { SalesPersonComponent } from './components/sales-person/sales-person.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewSalesPersonComponent} from './components/view-sales-person/view-sales-person.component';
import {SalesmanDetailsComponent} from './components/salesman-details/salesman-details.component';

import {CompanyListComponent} from './components/company-list/company-list.component';
import {CompanyDetailsComponent} from './components/company-details/company-details.component';

import { EditSalesPersonComponent } from './components/edit-sales-person/edit-sales-person.component';

import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { EditSupplierComponent } from './components/edit-supplier/edit-supplier.component';
import { EditCompanyInfoComponent } from './components/edit-company-info/edit-company-info.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import {CaseListComponent} from './components/case-list/case-list.component';
import { PasswordConfirmationComponent } from './components/password-confirmation/password-confirmation.component';
import {SettingComponent} from './components/setting/setting.component';

import { UpdateCompanyComponent } from './components/update-company/update-company.component';
import {CasesComponent} from './components/cases/cases.component';
import { EditCaseComponent } from './components/edit-case/edit-case.component';
import {UpdateCaseComponent} from './components/update-case/update-case.component';

const appRoutes: Routes = [
  {
    path : '',
    redirectTo: '/login',
    pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    redirectTo: '/login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'sales',
    component: SalesPersonComponent
  },
  {
    path: 'salesperson-list',
    component: ViewSalesPersonComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'salesman/:id',
    component: SalesmanDetailsComponent
  },
  {
    path: 'company-list',
    component: CompanyListComponent
  },
  {
    path: 'company/:id',
    component: CompanyDetailsComponent
  },
  {
    path: 'company-information/:id',
    component: EditCompanyComponent
  },
  {
    path: 'edit-salesman/:id',
    component: EditSalesPersonComponent
  },
  {
    path: 'case-list',
    component: CaseListComponent
  },
  {
    path: 'supplier/:id',
    component: EditSupplierComponent
  },
  {
    path: 'company-info/:id',
    component: EditCompanyInfoComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'update-password/:id',
    component: PasswordConfirmationComponent
  },
  {
    path: 'setting',
    component: SettingComponent,
  },
  {
    path: 'update-company/:id',
    component: UpdateCompanyComponent
  },
  {
    path: 'cases',
    component: CasesComponent
  },
  {
    path: 'edit-case/:id',
    component: EditCaseComponent
  },
  {
    path: 'update-case/:id',
    component: UpdateCaseComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
