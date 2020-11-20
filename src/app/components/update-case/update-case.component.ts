import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CaseService } from '../../services/case.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-case',
  templateUrl: './update-case.component.html',
  styleUrls: ['./update-case.component.css']
})
export class UpdateCaseComponent implements OnInit {

  startDate = new Date(1970, 0, 1);
  loading = false;
  submitted = false;
  status = ['商談中', '商談中断中', '失注', '受注', '失効', '解約'];
  gender = ['男', '女'];
  month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  data: any = {
    id: '',
    name: '',
    status: '',
    salesPersonName: '',
    userId: '',
    createdAt: '',
    salesPerson: '',
    clientInformation: [
      {
        id: '',
        clientName: '',
        corporateName: '',
        location: '',
        phone: '',
        industry: '',
        settlementMonth: '',
        enrolledInsurance: '',
        representativeName: '',
        representativeNameCeo: '',
        representativeBirthday: '',
        representativePersonSex: ''
      }
    ],
    officer: [
      {
        id: '',
        officerName: '',
        officerNickName: '',
        officierBirthday: '',
        offcierSex: '',
        officierPosition: '',
        officerRelationWithReprentative: ''
      }
    ],
    firstIntentionsFixed: [{
      id: '',
      questionName: '',
      answer: ''
    }],
    intentionsDaynamic: [
      {
        id: '',
        questionName: '',
        answer: ''
      }
    ],
    secondIntentionsDaynamic: [
      {
        id: '',
        questionName: '',
        answer: ''
      }
    ],
    secondInterviewContentFixed: [
      {
        id: '',
        questionName: '',
        answer: ''
      }
    ],
    firstIntentionDate:[
      {
        id: '',
        entity: '',
        intentionDate: ''
      }
    ],
    secondIntentionDate: [
      {
        id: '',
        entity: '',
        intentionDate: ''
      }
    ],

    differentBetween: [
      {
        id: '',
        entity: '',
        different: ''
      }
    ],
    othernotes: [
      {
        id: '',
        entity: '',
        different: ''
      }
    ],
    negotiationHistory: [
      {
        id: '',
        number: '',
        content: '',
        location: '',
        numberOfAttendant: ''
      }
    ],
    provisionRecord: [
      {
        id: '',
        productName: '',
        materials: '',
        reasonOfSelection: '',
        date: '',
        contract: '',
        action: ''
      }
    ]

  }
  id;
  dataValue;
  jsonObj: any;
  case: Object;
  sales$: Object;
  myForm: FormGroup;
  clientInformation: FormArray;
  officer: FormArray;
  intentItems: FormArray;
  firstIntentionDate: FormArray;
  secondIntentionDate: FormArray;
  firstIntentionsFixed: FormArray;
  intentionsDaynamic: FormArray;
  secondIntentionsFixed: FormArray;
  secondIntentionsDaynamic: FormArray;
  othernotes: FormArray;
  differentBetween: FormArray;
  negotiationHistory: FormArray;
  provisionRecord: FormArray;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute,
              private cookieService: CookieService, private datas: CaseService) {
    this.route.params.subscribe(params => { this.case = params.id; });
    this.id = this.case;
    let id = this.cookieService.get('id');
    let role = this.cookieService.get('role');
    const name = this.cookieService.get('name');
  }

  userId = this.cookieService.get('id');
  role = this.cookieService.get('role');
  name   = this.cookieService.get('name');

  ngOnInit() {
    this.myForm = this.formBuilder.group(
      {
        id: '',
        name: ['', Validators.required],
        status: '',
        salesPersonName: '',
        createdAt: '',
        salesPerson: '',
        userId: this.userId,
        clientInformation: this.formBuilder.array([this.createClientInformation(null)]),
        officer: this.formBuilder.array([]),
        firstIntentionDate: this.formBuilder.array([]),
        secondIntentionDate: this.formBuilder.array([]),
        intentionsDaynamic: this.formBuilder.array([]),
        firstIntentionsFixed: this.formBuilder.array([]),
        secondIntentionsDaynamic: this.formBuilder.array([]),
        secondIntentionsFixed: this.formBuilder.array([]),
        othernotes: this.formBuilder.array([]),
        differentBetween: this.formBuilder.array([]),
        negotiationHistory: this.formBuilder.array([]),
        provisionRecord: this.formBuilder.array([])
      }
    );

    this.http.get(environment.baseUrl + '/sales-person').subscribe(data => this.sales$ = data);

    this.datas.getCaseDetails(this.id).subscribe(
      data => {
        this.case = data;
        this.dataValue = JSON.stringify(this.case);
        this.jsonObj = JSON.parse(this.dataValue);

        let client = this.jsonObj.clientInformation;
        let ic = this.jsonObj.interviewContent;
        let icGrou = {};

        for (let itm of ic) {
          let key = this.smalize(itm.entity);
          if (!(key in this.jsonObj)) {
            this.jsonObj[key] = [];
          }
          this.jsonObj[key].push(itm);

        }

        let intentionDate = this.jsonObj.intentionDate;
        let intDate = this.jsonObj.intentionDate;
        let intDateGrou = {};

        for (let itm of intDate) {
          let key = this.smalize(itm.entity);
          if (!(key in this.jsonObj)) {
            this.jsonObj[key] = [];
          }
          this.jsonObj[key].push(itm);

        }

        let diffAndNote = this.jsonObj.differentInitialAndFinal;
        let diffAndNoteGrou = {};
        for (let itm of diffAndNote) {
          let key = this.smalize(itm.entity);
          if (!(key in this.jsonObj)) {
            this.jsonObj[key] = [];
          }
          this.jsonObj[key].push(itm);

        }

        this.myForm.get('name').setValue(this.jsonObj.name);
        this.myForm.get('status').setValue(this.jsonObj.status);
        this.myForm.get('salesPersonName').setValue(this.jsonObj.salesPersonName);

        this.myForm.get('clientInformation').get('0').get('id').setValue(this.jsonObj.clientInformation.id);
        this.myForm.get('clientInformation').get('0').get('clientName').setValue(this.jsonObj.clientInformation.clientName);
        this.myForm.get('clientInformation').get('0').get('corporateName').setValue(this.jsonObj.clientInformation.corporateName);
        this.myForm.get('clientInformation').get('0').get('location').setValue(this.jsonObj.clientInformation.location);
        this.myForm.get('clientInformation').get('0').get('phone').setValue(this.jsonObj.clientInformation.phone);
        this.myForm.get('clientInformation').get('0').get('industry').setValue(this.jsonObj.clientInformation.industry);
        this.myForm.get('clientInformation').get('0').get('settlementMonth').setValue(this.jsonObj.clientInformation.settlementMonth);
        this.myForm.get('clientInformation').get('0').get('enrolledInsurance').setValue(this.jsonObj.clientInformation.enrolledInsurance);
        this.myForm.get('clientInformation').get('0').get('representativeName').setValue(this.jsonObj.clientInformation.representativeName);
        this.myForm.get('clientInformation').get('0').get('representativeNameCeo')
          .setValue(this.jsonObj.clientInformation.representativeNameCeo);
        this.myForm.get('clientInformation').get('0').get('representativeBirthday')
          .setValue(this.jsonObj.clientInformation.representativeBirthday);
        this.myForm.get('clientInformation').get('0').get('representativePersonSex')
          .setValue(this.jsonObj.clientInformation.representativePersonSex);

        const officerItem = this.myForm.get('officer') as FormArray;
        for (let i = 0; i < this.jsonObj.officer.length; i++) {
          officerItem.push(this.createOfficer(this.jsonObj.officer[i]));
        }

        const firstIntDate = this.myForm.get('firstIntentionDate') as FormArray;
        for (let i = 0; i < this.jsonObj.firstIntentionDate.length; i++) {

          firstIntDate.push(this.createFirstIntentionDate(this.jsonObj.firstIntentionDate[i]));
        }

        const secondIntDate = this.myForm.get('secondIntentionDate') as FormArray;
        for (let i = 0; i < this.jsonObj.secondIntentionDate.length; i++) {
          secondIntDate.push(this.createSecondIntentionDate(this.jsonObj.secondIntentionDate[i]));
        }



        const firstIntFixed = this.myForm.get('firstIntentionsFixed') as FormArray;
        for (let i = 0; i < this.jsonObj.firstIntentionsFixed.length; i++) {
          firstIntFixed.push(this.createFirstInterviewContentFixed(this.jsonObj.firstIntentionsFixed[i]));
        }

        const firstIntDaynamic = this.myForm.get('intentionsDaynamic') as FormArray;
        for (let i = 0; i < this.jsonObj.intentionsDaynamic.length; i++) {
          firstIntDaynamic.push(this.createFirstInterviewContentDaynamic(this.jsonObj.intentionsDaynamic[i]));
        }

        const secondIntFixed = this.myForm.get('secondIntentionsFixed') as FormArray;
        for (let i = 0; i < this.jsonObj.secondIntentionsFixed.length; i++) {
          secondIntFixed.push(this.createSecondInterviewContentFixed(this.jsonObj.secondIntentionsFixed[i]));
        }

        const secondIntDaynamic = this.myForm.get('secondIntentionsDaynamic') as FormArray;
        for (let i = 0; i < this.jsonObj.secondIntentionsDaynamic.length; i++) {
          secondIntDaynamic.push(this.createSecondInterviewContentDaynamic(this.jsonObj.secondIntentionsDaynamic[i]));
        }

        const othernotes = this.myForm.get('othernotes') as FormArray;
        for (let i = 0; i < this.jsonObj.othernotes.length; i++) {
          othernotes.push(this.createOthernotes(this.jsonObj.othernotes[i]));
        }


        let differentBetween = this.myForm.get('differentBetween') as FormArray;
        for (let i = 0; i < this.jsonObj.differentBetween.length; i++) {
          differentBetween.push(this.createDifferentBetween(this.jsonObj.differentBetween[i]));
        }


        let negotiationHistory = this.myForm.get("negotiationHistory") as FormArray;
        for (let i = 0; i < this.jsonObj.negotiationHistory.length; i++) {
          negotiationHistory.push(this.createNegotiationHistory(this.jsonObj.negotiationHistory[i]));
        }

        let provisionRecord = this.myForm.get("provisionRecord") as FormArray;
        for (let i = 0; i < this.jsonObj.provisionRecord.length; i++) {
          provisionRecord.push(this.createProvisionRecord(this.jsonObj.provisionRecord[i]));
        }

      });

    var firstIntention = this.myForm.get('firstIntentionsFixed') as FormArray;

  }

  stopEnter(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  }

  smalize(s) {
    return s && s[0].toLowerCase() + s.slice(1);
  }


  createClientInformation(params: any) {
    return this.formBuilder.group({
      id: params != null ? params.id : '',
      clientName: params != null ? params.clientName : '',
      corporateName: params != null ? params.corporateName : '',
      location: params != null ? params.location : '',
      phone: params != null ? params.phone : '',
      industry: params != null ? params.industry : '',
      settlementMonth: params != null ? params.settlementMonth : '',
      enrolledInsurance: params != null ? params.enrolledInsurance : '',
      representativeName: params != null ? params.representativeName : '',
      representativeNameCeo: params != null ? params.representativeNameCeo : '',
      representativeBirthday: params != null ? params.representativeBirthday : '',
      representativePersonSex: params != null ? params.representativePersonSex : ''
    });
  }

  createOfficer(valu: any) {
    return this.formBuilder.group({
      id: valu != null ? valu.id : '',
      officerName: valu != null ? valu.officerName : '',
      officerNickName: valu != null ? valu.officerNickName : '',
      officierBirthday: valu != null ? valu.officierBirthday : '',
      offcierSex: valu != null ? valu.offcierSex : '',
      officierPosition: valu != null ? valu.officierPosition : '',
      officerRelationWithReprentative: valu != null ? valu.officerRelationWithReprentative : ''
    });
  }

  createFirstIntentionDate(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      entity: val != null ? val.entity : '',
      intentionDate: val != null ? val.intentionDate : ''
    });
  }

  createSecondIntentionDate(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      intentionDate: val != null ? val.intentionDate : '',
      entity: val != null ? val.entity : ''
    });
  }

  createFirstInterviewContentDaynamic(valu: any) {
    return this.formBuilder.group({
      id: valu != null ? valu.id : '',
      questionName: valu != null ? valu.question : '',
      answer: valu != null ? valu.answer : ''
    });
  }

  createFirstIntContentDaynamic() {
    return this.formBuilder.group({
      id: '',
      questionName: '',
      answer:  ''
    });
  }


  createFirstInterviewContentFixed(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      questionName: val != null ? val.question : '',
      answer: val != null ? val.answer : ''
    });
  }

  createSecondInterviewContentDaynamic(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      questionName: val != null ? val.question : '',
      answer: val != null ? val.answer : ''
    });
  }

  createSecondIntContentDaynamic() {
    return this.formBuilder.group({
      id: '',
      questionName:  '',
      answer:  ''
    });
  }

  createSecondInterviewContentFixed(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      questionName: val != null ? val.question : '',
      answer: val != null ? val.answer : ''
    });
  }

  createDifferentBetween(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      entity: val != null ? val.entity : '',
      different: val != null ? val.different : '',
    });
  }

  createOthernotes(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      entity: val != null ? val.entity : '',
      different: val != null ? val.different : '',
    });
  }

  createNegotiationHistory(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      number: val != null ? val.number : '',
      content: val != null ? val.content : '',
      location: val != null ? val.location : '',
      numberOfAttendant: val != null ? val.numberOfAttendant : ''
    });
  }

  createNegHistory() {
    return this.formBuilder.group({
      id: '',
      number: '',
      content:  '',
      location:  '',
      numberOfAttendant:  ''
    });
  }

  createProvisionRecord(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : '',
      productName: val != null ? val.productName : '',
      materials: val != null ? val.materials : '',
      reasonOfSelection: val != null ? val.reasonOfSelection : '',
      date: val != null ? val.date : '',
      contract: val != null ? val.contract : '',
      action: val != null ? val.action : '',
    });
  }

  createProRecord() {
    return this.formBuilder.group({
      id: '',
      productName: '',
      materials: '',
      reasonOfSelection: '',
      date: '',
      contract:  '',
      action:  '',
    });
  }



  addFirstInterviewContentDaynamic(): void {
    this.intentionsDaynamic = this.myForm.get('intentionsDaynamic') as FormArray;
    this.intentionsDaynamic.push(this.createFirstIntContentDaynamic());
    this.secondIntentionsDaynamic = this.myForm.get('secondIntentionsDaynamic') as FormArray;
    this.secondIntentionsDaynamic.push(this.createSecondIntContentDaynamic());
  }

  addSecondInterviewContentDaynamic(): void {
    this.secondIntentionsDaynamic = this.myForm.get('secondIntentionsDaynamic') as FormArray;
    this.secondIntentionsDaynamic.push(this.createSecondIntContentDaynamic());
  }

  addNegotiationHistory(): void {
    this.negotiationHistory = this.myForm.get('negotiationHistory') as FormArray;
    this.negotiationHistory.push(this.createNegHistory());
  }

  addProvisionRecord(): void {
    this.provisionRecord = this.myForm.get('provisionRecord') as FormArray;
    this.provisionRecord.push(this.createProRecord());
  }

  removedIntent(index: any): void {
    this.intentItems = this.myForm.get('intentionsDaynamic') as FormArray;
    if (index > 1) {
    this.intentItems.removeAt(index - 1);
    }

    this.intentItems = this.myForm.get('secondIntentionsDaynamic') as FormArray;
    if (index > 1) {
      this.intentItems.removeAt(index - 1);
    }
  }
  removedSecondIntention(index: any): void {
    this.intentItems = this.myForm.get('secondIntentionsDaynamic') as FormArray;
    if (index > 1) {
    this.intentItems.removeAt(index - 1);
    }
  }

removeNegotiationHistory(index: any): void {
    this.intentItems = this.myForm.get('negotiationHistory') as FormArray;
    this.intentItems.removeAt(index);
  }

  removedNegotiationHistory(index: any): void {
    this.intentItems = this.myForm.get('negotiationHistory') as FormArray;
    if (index > 1) {
     this.intentItems.removeAt(index - 1);
    }
  }

  removeProvisionRecord(index: any): void {
    this.intentItems = this.myForm.get('provisionRecord') as FormArray;
    this.intentItems.removeAt(index);
  }

  removedProvisionRecord(index: any): void {
    this.intentItems = this.myForm.get('provisionRecord') as FormArray;
    if (index > 1) {
      this.intentItems.removeAt(index - 1);
    }
  }

  get f() { return this.myForm.controls; }

  onSubmit() {

    this.submitted = true;
    if (this.myForm.invalid) {
      return false;
    }
    this.loading = true;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<any>(environment.baseUrl + '/update-case/' + this.id, JSON.stringify(this.myForm.value), httpOptions)
       .subscribe((res: any) => {
         this.router.navigate(['/edit-case/' + this.id]);
       },
       error => console.log(error));
  }

  createIntentionsFixed(val: any) {
    const x = this.formBuilder.group({
      id: '',
      questionName: '',
      answer: ''
    });
    if (val != null) {
      x.setValue(
        {
          id: val.id,
          questionName: val.questionName,
          answer: val.answer
        }
      );
    } else {
      x.setValue(
        {
          id: '',
          questionName: '♣死亡・高度障害の保障がほしい',
          answer: ''
        }
      );
    }

    return x;
  }

  isCheckedInention = false;

  checkSecondIntention(event) {
    if ( event.target.checked ) {
      this.isCheckedInention = true;
    } else {
      this.isCheckedInention = false;
    }
  }
  checkQuestion(i) {
    if (!this.isCheckedInention) {
      return;
    }
    const element = event.target as HTMLInputElement;
    if (element.checked) {
      const arrayControl = this.myForm.get('secondIntentionsFixed') as FormArray;
      arrayControl.setControl(i, this.createIntentionsFixed({id: arrayControl.at(i)['controls'].id.value,
        questionName: arrayControl.at(i)['controls'].questionName.value, 'answer': true }));
    }
  }

  checkedSecondIntention = false;

  copyFirstIntention(event) {
    if (event.target.checked) {
      this.checkedSecondIntention = true;

      const arrayControl = this.myForm.get('secondIntentionsFixed') as FormArray;
      const firstIntention = this.myForm.get('firstIntentionsFixed') as FormArray;

      const firstIntentionDynamic = this.myForm.get('intentionsDaynamic') as FormArray;
      const secondIntentionDynamic = this.myForm.get('secondIntentionsDaynamic') as FormArray;

      if (firstIntention.at(0)['controls'].answer.value === true) {
        arrayControl.setControl(0, this.createIntentionsFixed({id: arrayControl.at(0)['controls'].id.value,
          questionName: arrayControl.at(0)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(0)['controls'].answer.value === false) {
        arrayControl.setControl(0, this.createIntentionsFixed({id: arrayControl.at(0)['controls'].id.value,
          questionName: arrayControl.at(0)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(1)['controls'].answer.value === true) {
        arrayControl.setControl(1, this.createIntentionsFixed({id: arrayControl.at(1)['controls'].id.value,
          questionName: arrayControl.at(1)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(1)['controls'].answer.value === false) {
        arrayControl.setControl(1, this.createIntentionsFixed({id: arrayControl.at(1)['controls'].id.value,
          questionName: arrayControl.at(1)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(2)['controls'].answer.value === true) {
        arrayControl.setControl(2, this.createIntentionsFixed({id: arrayControl.at(2)['controls'].id.value,
          questionName: arrayControl.at(2)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(2)['controls'].answer.value === false) {
        arrayControl.setControl(2, this.createIntentionsFixed({id: arrayControl.at(2)['controls'].id.value,
          questionName: arrayControl.at(2)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(3)['controls'].answer.value === true) {
        arrayControl.setControl(3, this.createIntentionsFixed({id: arrayControl.at(3)['controls'].id.value,
          questionName: arrayControl.at(3)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(3)['controls'].answer.value === false) {
        arrayControl.setControl(3, this.createIntentionsFixed({id: arrayControl.at(3)['controls'].id.value,
          questionName: arrayControl.at(3)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(4)['controls'].answer.value === true) {
        arrayControl.setControl(4, this.createIntentionsFixed({id: arrayControl.at(4)['controls'].id.value,
          questionName: arrayControl.at(4)['controls'].questionName.value, 'answer': true }));
      } else  if (firstIntention.at(4)['controls'].answer.value === false) {
        arrayControl.setControl(4, this.createIntentionsFixed({id: arrayControl.at(4)['controls'].id.value,
          questionName: arrayControl.at(4)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(5)['controls'].answer.value === true) {
        arrayControl.setControl(5, this.createIntentionsFixed({id: arrayControl.at(5)['controls'].id.value,
          questionName: arrayControl.at(5)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(5)['controls'].answer.value === false) {
        arrayControl.setControl(5, this.createIntentionsFixed({id: arrayControl.at(5)['controls'].id.value,
          questionName: arrayControl.at(5)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(6)['controls'].answer.value === true) {
        arrayControl.setControl(6, this.createIntentionsFixed({id: arrayControl.at(6)['controls'].id.value,
          questionName: arrayControl.at(6)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(6)['controls'].answer.value === false) {
        arrayControl.setControl(6, this.createIntentionsFixed({id: arrayControl.at(6)['controls'].id.value,
          questionName: arrayControl.at(6)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(7)['controls'].answer.value === true) {
        arrayControl.setControl(7, this.createIntentionsFixed({id: arrayControl.at(7)['controls'].id.value,
          questionName: arrayControl.at(7)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(7)['controls'].answer.value === false) {
        arrayControl.setControl(7, this.createIntentionsFixed({id: arrayControl.at(7)['controls'].id.value,
          questionName: arrayControl.at(7)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(8)['controls'].answer.value === true) {
        arrayControl.setControl(8, this.createIntentionsFixed({id: arrayControl.at(8)['controls'].id.value,
          questionName: arrayControl.at(8)['controls'].questionName.value, 'answer': true }));
      } else  if (firstIntention.at(8)['controls'].answer.value === false) {
        arrayControl.setControl(8, this.createIntentionsFixed({id: arrayControl.at(8)['controls'].id.value,
          questionName: arrayControl.at(8)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(9)['controls'].answer.value === true) {
        arrayControl.setControl(9, this.createIntentionsFixed({id: arrayControl.at(9)['controls'].id.value,
          questionName: arrayControl.at(9)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(9)['controls'].answer.value === false) {
        arrayControl.setControl(9, this.createIntentionsFixed({id: arrayControl.at(9)['controls'].id.value,
          questionName: arrayControl.at(9)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(10)['controls'].answer.value === true) {
        arrayControl.setControl(10, this.createIntentionsFixed({id: arrayControl.at(10)['controls'].id.value,
          questionName: arrayControl.at(10)['controls'].questionName.value, 'answer': true }));
      } if (firstIntention.at(10)['controls'].answer.value === false) {
        arrayControl.setControl(10, this.createIntentionsFixed({id: arrayControl.at(10)['controls'].id.value,
          questionName: arrayControl.at(10)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(11)['controls'].answer.value === true) {
        arrayControl.setControl(11, this.createIntentionsFixed({id: arrayControl.at(11)['controls'].id.value,
          questionName: arrayControl.at(11)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(11)['controls'].answer.value === false) {
        arrayControl.setControl(11, this.createIntentionsFixed({id: arrayControl.at(11)['controls'].id.value,
          questionName: arrayControl.at(11)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(12)['controls'].answer.value === true) {
        arrayControl.setControl(12, this.createIntentionsFixed({id: arrayControl.at(12)['controls'].id.value,
          questionName: arrayControl.at(12)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(12)['controls'].answer.value === false) {
        arrayControl.setControl(12, this.createIntentionsFixed({id: arrayControl.at(12)['controls'].id.value,
          questionName: arrayControl.at(12)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(13)['controls'].answer.value === true) {
        arrayControl.setControl(13, this.createIntentionsFixed({id: arrayControl.at(13)['controls'].id.value,
          questionName: arrayControl.at(13)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(13)['controls'].answer.value === false) {
        arrayControl.setControl(13, this.createIntentionsFixed({id: arrayControl.at(13)['controls'].id.value,
          questionName: arrayControl.at(13)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(14)['controls'].answer.value === true) {
        arrayControl.setControl(14, this.createIntentionsFixed({id: arrayControl.at(14)['controls'].id.value,
          questionName: arrayControl.at(14)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(14)['controls'].answer.value === false) {
        arrayControl.setControl(14, this.createIntentionsFixed({id: arrayControl.at(14)['controls'].id.value,
          questionName: arrayControl.at(14)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(15)['controls'].answer.value === true) {
        arrayControl.setControl(15, this.createIntentionsFixed({id: arrayControl.at(15)['controls'].id.value,
          questionName: arrayControl.at(15)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(15)['controls'].answer.value === false) {
        arrayControl.setControl(15, this.createIntentionsFixed({id: arrayControl.at(15)['controls'].id.value,
          questionName: arrayControl.at(15)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(16)['controls'].answer.value === true) {
        arrayControl.setControl(16, this.createIntentionsFixed({id: arrayControl.at(16)['controls'].id.value,
          questionName: arrayControl.at(16)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(16)['controls'].answer.value === false) {
        arrayControl.setControl(16, this.createIntentionsFixed({id: arrayControl.at(16)['controls'].id.value,
          questionName: arrayControl.at(16)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(17)['controls'].answer.value === true) {
        arrayControl.setControl(17, this.createIntentionsFixed({id: arrayControl.at(17)['controls'].id.value,
          questionName: arrayControl.at(17)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(17)['controls'].answer.value === false) {
        arrayControl.setControl(17, this.createIntentionsFixed({id: arrayControl.at(17)['controls'].id.value,
          questionName: arrayControl.at(17)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(18)['controls'].answer.value === true) {
        arrayControl.setControl(18, this.createIntentionsFixed({id: arrayControl.at(18)['controls'].id.value,
          questionName: arrayControl.at(18)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(18)['controls'].answer.value === false) {
        arrayControl.setControl(18, this.createIntentionsFixed({id: arrayControl.at(18)['controls'].id.value,
          questionName: arrayControl.at(18)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(19)['controls'].answer.value === true) {
        arrayControl.setControl(19, this.createIntentionsFixed({id: arrayControl.at(19)['controls'].id.value,
          questionName: arrayControl.at(19)['controls'].questionName.value, 'answer': true }));
      } else  if (firstIntention.at(19)['controls'].answer.value === false) {
        arrayControl.setControl(19, this.createIntentionsFixed({id: arrayControl.at(19)['controls'].id.value,
          questionName: arrayControl.at(19)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(20)['controls'].answer.value === true) {
        arrayControl.setControl(20, this.createIntentionsFixed({id: arrayControl.at(20)['controls'].id.value,
          questionName: arrayControl.at(20)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(20)['controls'].answer.value === false) {
        arrayControl.setControl(20, this.createIntentionsFixed({id: arrayControl.at(20)['controls'].id.value,
          questionName: arrayControl.at(20)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(21)['controls'].answer.value === true) {
        arrayControl.setControl(21, this.createIntentionsFixed({id: arrayControl.at(21)['controls'].id.value,
          questionName: arrayControl.at(21)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(21)['controls'].answer.value === false) {
        arrayControl.setControl(21, this.createIntentionsFixed({id: arrayControl.at(21)['controls'].id.value,
          questionName: arrayControl.at(21)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(22)['controls'].answer.value === true) {
        arrayControl.setControl(22, this.createIntentionsFixed({id: arrayControl.at(22)['controls'].id.value,
          questionName: arrayControl.at(22)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(22)['controls'].answer.value === false) {
        arrayControl.setControl(22, this.createIntentionsFixed({id: arrayControl.at(22)['controls'].id.value,
          questionName: arrayControl.at(22)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(23)['controls'].answer.value === true) {
        arrayControl.setControl(23, this.createIntentionsFixed({id: arrayControl.at(23)['controls'].id.value,
          questionName: arrayControl.at(23)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(23)['controls'].answer.value === false) {
        arrayControl.setControl(23, this.createIntentionsFixed({id: arrayControl.at(23)['controls'].id.value,
          questionName: arrayControl.at(23)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(24)['controls'].answer.value === true) {
        arrayControl.setControl(24, this.createIntentionsFixed({id: arrayControl.at(24)['controls'].id.value,
          questionName: arrayControl.at(24)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(24)['controls'].answer.value === false) {
        arrayControl.setControl(24, this.createIntentionsFixed({id: arrayControl.at(24)['controls'].id.value,
          questionName: arrayControl.at(24)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(25)['controls'].answer.value === true) {
        arrayControl.setControl(25, this.createIntentionsFixed({id: arrayControl.at(25)['controls'].id.value,
          questionName: arrayControl.at(25)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(25)['controls'].answer.value === false) {
        arrayControl.setControl(25, this.createIntentionsFixed({id: arrayControl.at(25)['controls'].id.value,
          questionName: arrayControl.at(25)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(26)['controls'].answer.value === true) {
        arrayControl.setControl(26, this.createIntentionsFixed({id: arrayControl.at(26)['controls'].id.value,
          questionName: arrayControl.at(26)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(26)['controls'].answer.value === false) {
        arrayControl.setControl(26, this.createIntentionsFixed({id: arrayControl.at(26)['controls'].id.value,
          questionName: arrayControl.at(26)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(27)['controls'].answer.value === true) {
        arrayControl.setControl(27, this.createIntentionsFixed({id: arrayControl.at(27)['controls'].id.value,
          questionName: arrayControl.at(27)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(27)['controls'].answer.value === false) {
        arrayControl.setControl(27, this.createIntentionsFixed({id: arrayControl.at(27)['controls'].id.value,
          questionName: arrayControl.at(27)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(28)['controls'].answer.value === true) {
        arrayControl.setControl(28, this.createIntentionsFixed({id: arrayControl.at(28)['controls'].id.value,
          questionName: arrayControl.at(28)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(28)['controls'].answer.value === false) {
        arrayControl.setControl(28, this.createIntentionsFixed({id: arrayControl.at(28)['controls'].id.value,
          questionName: arrayControl.at(28)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(29)['controls'].answer.value === true) {
        arrayControl.setControl(29, this.createIntentionsFixed({id: arrayControl.at(29)['controls'].id.value,
          questionName: arrayControl.at(29)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(29)['controls'].answer.value === false) {
        arrayControl.setControl(29, this.createIntentionsFixed({id: arrayControl.at(29)['controls'].id.value,
          questionName: arrayControl.at(29)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(30)['controls'].answer.value === true) {
        arrayControl.setControl(30, this.createIntentionsFixed({id: arrayControl.at(30)['controls'].id.value,
          questionName: arrayControl.at(30)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(30)['controls'].answer.value === false) {
        arrayControl.setControl(30, this.createIntentionsFixed({id: arrayControl.at(30)['controls'].id.value,
          questionName: arrayControl.at(30)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(0)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(0, this.createIntentionsFixed({ id: secondIntentionDynamic.at(0)['controls'].id.value,
          questionName: secondIntentionDynamic.at(0)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(0)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(0, this.createIntentionsFixed({id: secondIntentionDynamic.at(0)['controls'].id.value,
          questionName: secondIntentionDynamic.at(0)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(1)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(1, this.createIntentionsFixed({id: secondIntentionDynamic.at(1)['controls'].id.value,
          questionName: secondIntentionDynamic.at(1)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(1)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(1, this.createIntentionsFixed({id: secondIntentionDynamic.at(1)['controls'].id.value,
          questionName: secondIntentionDynamic.at(1)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(2)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(2, this.createIntentionsFixed({id: secondIntentionDynamic.at(2)['controls'].id.value,
          questionName: secondIntentionDynamic.at(2)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(2)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(2, this.createIntentionsFixed({id: secondIntentionDynamic.at(2)['controls'].id.value,
          questionName: secondIntentionDynamic.at(2)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(3)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(3, this.createIntentionsFixed({id: secondIntentionDynamic.at(3)['controls'].id.value,
          questionName: secondIntentionDynamic.at(3)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(3)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(3, this.createIntentionsFixed({id: secondIntentionDynamic.at(3)['controls'].id.value,
          questionName: secondIntentionDynamic.at(3)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(4)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(4, this.createIntentionsFixed({id: secondIntentionDynamic.at(4)['controls'].id.value,
          questionName: secondIntentionDynamic.at(4)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(4)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(4, this.createIntentionsFixed({id: secondIntentionDynamic.at(4)['controls'].id.value,
          questionName: secondIntentionDynamic.at(4)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(5)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(5, this.createIntentionsFixed({id: secondIntentionDynamic.at(5)['controls'].id.value,
          questionName: secondIntentionDynamic.at(5)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(5)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(5, this.createIntentionsFixed({id: secondIntentionDynamic.at(5)['controls'].id.value,
          questionName: secondIntentionDynamic.at(5)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(6)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(6, this.createIntentionsFixed({id: secondIntentionDynamic.at(6)['controls'].id.value,
          questionName: secondIntentionDynamic.at(6)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(6)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(6, this.createIntentionsFixed({id: secondIntentionDynamic.at(6)['controls'].id.value,
          questionName: secondIntentionDynamic.at(6)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(7)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(7, this.createIntentionsFixed({id: secondIntentionDynamic.at(7)['controls'].id.value,
          questionName: secondIntentionDynamic.at(7)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(7)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(7, this.createIntentionsFixed({id: secondIntentionDynamic.at(7)['controls'].id.value,
          questionName: secondIntentionDynamic.at(7)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(8)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(8, this.createIntentionsFixed({id: secondIntentionDynamic.at(8)['controls'].id.value,
          questionName: secondIntentionDynamic.at(8)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(8)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(8, this.createIntentionsFixed({id: secondIntentionDynamic.at(8)['controls'].id.value,
          questionName: secondIntentionDynamic.at(8)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(9)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(9, this.createIntentionsFixed({id: secondIntentionDynamic.at(9)['controls'].id.value,
          questionName: secondIntentionDynamic.at(9)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(9)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(9, this.createIntentionsFixed({id: secondIntentionDynamic.at(9)['controls'].id.value,
          questionName: secondIntentionDynamic.at(3)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(10)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(10, this.createIntentionsFixed({id: secondIntentionDynamic.at(10)['controls'].id.value,
          questionName: secondIntentionDynamic.at(10)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(10)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(10, this.createIntentionsFixed({id: secondIntentionDynamic.at(10)['controls'].id.value,
          questionName: secondIntentionDynamic.at(10)['controls'].questionName.value, 'answer': false }));
      }




    } else {
      console.log('unchecked');

      this.checkedSecondIntention = false;
      /*this.checkedSecondIntention = true;*/
     /*const secondIntention = this.myForm.get('secondIntentionsFixed') as FormArray;
     const secondIntentionOriginal = this.secondIntentionsFixed;
     const firstIntention = this.myForm.get('firstIntentionsFixed') as FormArray;

      if (secondIntentionOriginal.at(7)['controls'].answer.value === true) {
        secondIntention.setControl(0, this.createIntentionsFixed({id: secondIntention.at(0)['controls'].id.value,
          questionName: secondIntention.at(0)['controls'].questionName.value, 'answer': true }));
      } else {
        secondIntention.setControl(0, this.createIntentionsFixed({id: secondIntention.at(0)['controls'].id.value,
          questionName: secondIntention.at(0)['controls'].questionName.value, 'answer': false }));
      }*/
    }
  }

  checkedFirstIntention(i) {
    if (!this.checkedSecondIntention) {
      return;
    }
    const element = event.target as HTMLInputElement;

    if (element.checked) {
      const arrayControl = this.myForm.get('secondIntentionsFixed') as FormArray;
      arrayControl.setControl(i, this.createIntentionsFixed({id: arrayControl.at(i)['controls'].id.value,
        questionName: arrayControl.at(i)['controls'].questionName.value, 'answer': true }));
    }
  }

}
