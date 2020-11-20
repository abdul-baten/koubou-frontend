import { Component, OnInit } from '@angular/core';
import {Setting} from '../../models/setting.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CompanyService} from '../../services/company.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  inputDate = true;
  setting$: Object;
  setting: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: String;
  dataValue;
  jsonObj: any;

  constructor(private http: HttpClient, private router: Router, private data: CompanyService, private formBuilder: FormBuilder) {
  }

  onSubmit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<any>(environment.baseUrl + '/save-setting', JSON.stringify(this.setting.value), httpOptions)
      .subscribe( (res: any) => {
          console.log(res);
          this.router.navigate(['/case-list']);
        },
        error => console.log(error));
  }

  ngOnInit() {

    this.setting = this.formBuilder.group({
      id: '',
      caseName: '',
      inputDate: '',
      settlementMonth: '',
      representativePersionName: '',
      salesPersonName: '',
      status: '',
      corporateName: '',
      representativePersionPhone: '',
      industry: '',
      salesPersonlocation: '',
      representativePersionBirthday: ''
    });

    this.data.getSetting(this.setting$).subscribe(
      data => {
        this.setting$ = data;
        this.dataValue = JSON.stringify(this.setting$);
        this.jsonObj = JSON.parse(this.dataValue);
        this.setting.get('id').setValue(this.jsonObj.id);
        console.log('Result' + this.setting);
        this.setting.get('caseName').setValue(this.jsonObj.caseName);
        this.setting.get('inputDate').setValue(this.jsonObj.inputDate);
        this.setting.get('settlementMonth').setValue(this.jsonObj.settlementMonth);
        this.setting.get('representativePersionName').setValue(this.jsonObj.representativePersionName);
        this.setting.get('salesPersonName').setValue(this.jsonObj.salesPersonName);
        this.setting.get('status').setValue(this.jsonObj.status);
        this.setting.get('corporateName').setValue(this.jsonObj.corporateName);
        this.setting.get('representativePersionPhone').setValue(this.jsonObj.representativePersionPhone);
        this.setting.get('industry').setValue(this.jsonObj.industry);
        this.setting.get('salesPersonlocation').setValue(this.jsonObj.salesPersonlocation);
        this.setting.get('representativePersionBirthday').setValue(this.jsonObj.representativePersionBirthday);
      }
    );
  }

}
