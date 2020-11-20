import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class CasesComponent implements OnInit {

startDate = new Date(1970, 0, 1);

  nameErrorMessage: string = '';
  loading = false;
  submitted = false;
  status = ['商談中', '商談中断中', '失注', '受注', '失効', '解約'];
  gender = ['男', '女'];
  month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  data: any = {
    name: new FormControl('', Validators.required),
    status: '',
    salesPersonName: '',
    userId: '',
    customers: [
      {
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
    officers: [
      {
        officerName: '',
        officerNickName: '',
        officierBirthday: '',
        offcierSex: '',
        officierPosition: '',
        officerRelationWithReprentative: ''
      }
    ],
    intentionsFixed: [{
      questionName: '',
      answer: ''
    }],
    intentions: [
      {
        questionName: '',
        answer: ''
      }
    ],
    secondIntentions: [
      {
        questionName: '',
        answer: ''
      }
    ],
    secondIntentionsFixed: [
      {
        questionName: '',
        answer: ''
      }
    ],
    differentBetween: [
      {
        different: ''
      }
    ],
    firstIntentionDate: [
      {
        intentionDate: ''
      }
    ],
    secondIntentionDate: [
      {
        intentionDate: ''
      }
    ],
    othernotes: [
      {
        different: ''
      }
    ],
    negotiationHistory: [
      {
        number: '',
        content: '',
        location: '',
        numberOfAttendant: ''
      }
    ],
    provisionRecord: [
      {
        productName: '',
        materials: '',
        reasonOfSelection: '',
        date: '',
        contract: '',
        action: ''
      }
    ]

  }


  sales$: Object;
  myForm: FormGroup;
  customers: FormArray;
  intentionsFixed: FormArray;
  officerItems: FormArray;
  intentItems: FormArray;
  secondIntentions: FormArray;
  firstIntentionsFixed: FormArray;
  secondIntentionsFixed: FormArray;
  firstIntentionDate: FormArray;
  secondIntentionDate: FormArray;
  differentBetween: FormArray;
  othernotes: FormArray;
  negotiationHistory: FormArray;
  provisionRecord: FormArray;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private cookieService: CookieService) {
    let id = this.cookieService.get('id');
    let name = this.cookieService.get('name');
    let email = this.cookieService.get('email');
    let password = this.cookieService.get('password');
    let role = this.cookieService.get('role');
    let companyId = this.cookieService.get('company_id');


    if (email == "" && email == null && password == "" && password == null) {
      this.router.navigate(['/login']);
    }
  }

  userId = this.cookieService.get('id');
  id = this.cookieService.get('id');
  name = this.cookieService.get('name');
  email = this.cookieService.get('email');
  role = this.cookieService.get('role');

  ngOnInit() {
    this.myForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        status: '',
        salesPersonName: '',
        userId: this.userId,
        customers: this.formBuilder.array([this.createCustomer()]),
        officers: this.formBuilder.array([this.createOfficer(), this.createOfficer(), this.createOfficer()]),
        intentions: this.formBuilder.array([this.createIntention()]),
        intentionsFixed: this.formBuilder.array([this.createIntentionsFixed(null)]),
        secondIntentions: this.formBuilder.array([this.createSecondIntentions()]),
        secondIntentionsFixed: this.formBuilder.array([this.createSecondIntentionsFixed(null)]),
        differentBetween: this.formBuilder.array([this.createDifferentInitialFinal()]),
        firstIntentionDate: this.formBuilder.array([this.createFirstIntentionDate()]),
        secondIntentionDate: this.formBuilder.array([this.createSecondIntentionDate()]),
        othernotes: this.formBuilder.array([this.createOthernotes()]),
        negotiationHistory: this.formBuilder.array([this.createNegotiationHistory()]),
        provisionRecord: this.formBuilder.array([this.createProvisionRecord()])
      }
    );

    let intentControl = this.myForm.get('intentionsFixed') as FormArray;
    /*intentControl.push(this.createIntentionsFixed({questionName: '♣死亡・高度障害の保障がほしい', 'answer': ''}));*/
    intentControl.push(this.createIntentionsFixed({ questionName: '経営者のための死亡・高度障害の保障が欲しい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '福利厚生として従業員のための死亡・高度障害の保証が欲しい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '事業承継資金を準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '死亡保障と同時に勇退退職金の財源を早く確保できる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '高度障害保険金受取人を被保険者にできる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '外貨建ての商品(死亡・高度障害保障)も検討したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '死亡・高度障害の保険は支払保険料が損金扱いにできる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '保険金等の支払手続きが簡便で、早く受取る制度がある保険会社が望ましい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '長期にわたる死亡保障は、規模が大きく、健全性のある保険会社に任せたい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '♥医療費・入院費の保障がほしい(特定疾病・障害の保障を含む)', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '経営者のための医療保障がほしい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '福利厚生として従業員のための医療保障がほしい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '先進医療、三大疾病への保障がほしい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '短期の入院でも、まとまった給付金が出る商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: 'がんと診断された時に手厚い給付金が出る商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: 'がんへの保障と同時に勇退退職金の財源を確保できる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: 'がんに備えながら、経営者が高齢になっても勇退退職金の財源を確保できる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '勇退後もがんの保障を個人に引き継ぐことができる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '医療保険は支払保険料が損金扱いにできる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '長期にわたる医療保障は、規模が大きく、健全性のある保険会社に任せたい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '♠介護の保障がほしい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '経営者のための介護保障がほしい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '介護保障と同時に退職金財源を確保できる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '介護保険金の受取後に死亡保障が残る商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '介護保険金受取人を被保険者にできる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '勇退後も介護の保障を個人に引き継ぐことができる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '介護保険は支払保険料が現金扱いにできる商品で準備したい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '長期にわたる介護保障は、規模が大きく、健全性のある保険会社に任せたい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '♦長生きに対する備え・資産の形成がしたい', 'answer': '' }));
    intentControl.push(this.createIntentionsFixed({ questionName: '外貨の活用により会社の資産力を高めたい', 'answer': '' }));

    let SecondIntentControl = this.myForm.get('secondIntentionsFixed') as FormArray;
    /*SecondIntentControl.push(this.createIntentionsFixed({questionName: '♣死亡・高度障害の保障がほしい', 'answer': ''}));*/
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '経営者のための死亡・高度障害の保障が欲しい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '福利厚生として従業員のための死亡・高度障害の保証が欲しい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '事業承継資金を準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '死亡保障と同時に勇退退職金の財源を早く確保できる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '高度障害保険金受取人を被保険者にできる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '外貨建ての商品(死亡・高度障害保障)も検討したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '死亡・高度障害の保険は支払保険料が損金扱いにできる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '保険金等の支払手続きが簡便で、早く受取る制度がある保険会社が望ましい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '長期にわたる死亡保障は、規模が大きく、健全性のある保険会社に任せたい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '♥医療費・入院費の保障がほしい(特定疾病・障害の保障を含む)', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '経営者のための医療保障がほしい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '福利厚生として従業員のための医療保障がほしい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '先進医療、三大疾病への保障がほしい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '短期の入院でも、まとまった給付金が出る商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: 'がんと診断された時に手厚い給付金が出る商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: 'がんへの保障と同時に勇退退職金の財源を確保できる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: 'がんに備えながら、経営者が高齢になっても勇退退職金の財源を確保できる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '勇退後もがんの保障を個人に引き継ぐことができる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '医療保険は支払保険料が損金扱いにできる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '長期にわたる医療保障は、規模が大きく、健全性のある保険会社に任せたい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '♠介護の保障がほしい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '経営者のための介護保障がほしい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '介護保障と同時に退職金財源を確保できる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '介護保険金の受取後に死亡保障が残る商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '介護保険金受取人を被保険者にできる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '勇退後も介護の保障を個人に引き継ぐことができる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '介護保険は支払保険料が現金扱いにできる商品で準備したい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '長期にわたる介護保障は、規模が大きく、健全性のある保険会社に任せたい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '♦長生きに対する備え・資産の形成がしたい', 'answer': '' }));
    SecondIntentControl.push(this.createIntentionsFixed({ questionName: '外貨の活用により会社の資産力を高めたい', 'answer': '' }));


    this.myForm.get('');
    this.http.get(environment.baseUrl + '/sales-person').subscribe(data => this.sales$ = data);
  }

  stopEnter(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  }


  createCustomer() {
    return this.formBuilder.group({
      clientName: [''],
      corporateName: [''],
      location: [''],
      phone: [''],
      industry: [''],
      settlementMonth: [''],
      enrolledInsurance: [''],
      representativeName: [''],
      representativeNameCeo: [''],
      representativeBirthday: [''],
      representativePersonSex: ['']
    });
  }

  createOfficer() {
    return this.formBuilder.group({
      officerName: '',
      officerNickName: '',
      officierBirthday: '',
      offcierSex: '',
      officierPosition: '',
      officerRelationWithReprentative: ''
    });
  }

  createIntention() {
    return this.formBuilder.group({
      questionName: '',
      answer: ''
    });
  }

  seconDate(val: any) {
    let x1 = this.formBuilder.group({
      questionName: '',
      answer: ''
    });

    return x1;
  }
  createIntentionsFixed(val: any) {
    let x = this.formBuilder.group({
      //id = '',
      questionName: '',
      answer: ''
    });
    if (val != null) {
      x.setValue(
        {
          questionName: val.questionName,
          answer: val.answer
        }
      );
    } else {
      x.setValue(
        {
          //id='',
          questionName: '♣死亡・高度障害の保障がほしい',
          answer: ''
        }
      );
    }

    return x;
  }

  createSecondIntentions() {
    return this.formBuilder.group({
      questionName: '',
      answer: ''
    });
  }

  createSecondIntentionsFixed(val: any) {
    let y = this.formBuilder.group({
      questionName: '',
      answer: ''
    });

    if (val != null) {
      y.setValue(
        {
          questionName: val.questionName,
          answer: val.answer
        }
      );
    } else {
      y.setValue(
        {
          questionName: '♣死亡・高度障害の保障がほしい',
          answer: ''
        }
      );
    }
    return y;
  }

  createDifferentInitialFinal() {
    return this.formBuilder.group({
      different: ''
    });
  }

  createFirstIntentionDate() {
    return this.formBuilder.group({
      intentionDate: ''
    });
  }

  createSecondIntentionDate() {
    return this.formBuilder.group({
      intentionDate: ''
    });
  }

  createOthernotes() {
    return this.formBuilder.group({
      different: '',
    });
  }

  createNegotiationHistory() {
    return this.formBuilder.group({
      number: '',
      content: '',
      location: '',
      numberOfAttendant: ''
    });
  }

  createProvisionRecord() {
    return this.formBuilder.group({
      productName: '',
      materials: '',
      reasonOfSelection: '',
      date: '',
      contract: '',
      action: ''
    });
  }



  addIntent(): void {
    this.intentItems = this.myForm.get('intentions') as FormArray;
    this.intentItems.push(this.createIntention());

    this.intentItems = this.myForm.get('secondIntentions') as FormArray;
    this.intentItems.push(this.createSecondIntentions());
  }

  addSecondIntention(): void {
    this.intentItems = this.myForm.get('secondIntentions') as FormArray;
    this.intentItems.push(this.createSecondIntentions());
  }

  addNegotiationHistory(): void {
    this.intentItems = this.myForm.get('negotiationHistory') as FormArray;
    this.intentItems.push(this.createNegotiationHistory());
  }

  addProvisionRecord(): void {
    this.intentItems = this.myForm.get('provisionRecord') as FormArray;
    this.intentItems.push(this.createProvisionRecord());
  }

  removedIntent(index: any): void {
    this.intentItems = this.myForm.get('intentions') as FormArray;
    if (index > 1) {
    this.intentItems.removeAt(index - 1);
    }
    this.intentItems = this.myForm.get('secondIntentions') as FormArray;
    if (index > 1) {
      this.intentItems.removeAt(index - 1);
    }

  }
  removedSecondIntention(index: any): void {
    this.intentItems = this.myForm.get('secondIntentions') as FormArray;
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
    let JsonValue = JSON.stringify(this.myForm.value);

     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     }

     this.http.post<any>(environment.baseUrl + '/create-case', JSON.stringify(this.myForm.value), httpOptions)
       .subscribe((res: any) => {
         console.log(res);
         this.router.navigate(['/case-list']);
       },
       error => console.log(error));
  }

  isCheckedInention = false;

  checkSecondIntention(event) {
    if ( event.target.checked ) {
      this.isCheckedInention = true;
      //this.checkQuestion(i);
    } else {
      this.isCheckedInention = false;
    }
  }
  checkQuestion(i) {
    if(!this.isCheckedInention){
      return;
    }
    let element = event.target as HTMLInputElement;

    if (element.checked) {
      console.log(event);
      var arrayControl = this.myForm.get('secondIntentionsFixed') as FormArray;
      arrayControl.setControl(i, this.createIntentionsFixed({ questionName: arrayControl.at(i)['controls'].questionName.value, 'answer': true }));
    }
  }

  copyFirstIntention(event) {

    if (event.target.checked) {

      const arrayControl = this.myForm.get('secondIntentionsFixed') as FormArray;
      const firstIntention = this.myForm.get('intentionsFixed') as FormArray;

      const firstIntentionDynamic = this.myForm.get('intentions') as FormArray;
      const secondIntentionDynamic = this.myForm.get('secondIntentions') as FormArray;

      if (firstIntention.at(0)['controls'].answer.value === true) {
        arrayControl.setControl(0, this.createIntentionsFixed({
          questionName: arrayControl.at(0)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(0)['controls'].answer.value === false) {
        arrayControl.setControl(0, this.createIntentionsFixed({
          questionName: arrayControl.at(0)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(1)['controls'].answer.value === true) {
        arrayControl.setControl(1, this.createIntentionsFixed({
          questionName: arrayControl.at(1)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(1)['controls'].answer.value === false) {
        arrayControl.setControl(1, this.createIntentionsFixed({
          questionName: arrayControl.at(1)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(2)['controls'].answer.value === true) {
        arrayControl.setControl(2, this.createIntentionsFixed({
          questionName: arrayControl.at(2)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(2)['controls'].answer.value === false) {
        arrayControl.setControl(2, this.createIntentionsFixed({
          questionName: arrayControl.at(2)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(3)['controls'].answer.value === true) {
        arrayControl.setControl(3, this.createIntentionsFixed({
          questionName: arrayControl.at(3)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(3)['controls'].answer.value === false) {
        arrayControl.setControl(3, this.createIntentionsFixed({
          questionName: arrayControl.at(3)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(4)['controls'].answer.value === true) {
        arrayControl.setControl(4, this.createIntentionsFixed({
          questionName: arrayControl.at(4)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(4)['controls'].answer.value === false) {
        arrayControl.setControl(4, this.createIntentionsFixed({
          questionName: arrayControl.at(4)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(5)['controls'].answer.value === true) {
        arrayControl.setControl(5, this.createIntentionsFixed({
          questionName: arrayControl.at(5)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(5)['controls'].answer.value === false) {
        arrayControl.setControl(5, this.createIntentionsFixed({
          questionName: arrayControl.at(5)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(6)['controls'].answer.value === true) {
        arrayControl.setControl(6, this.createIntentionsFixed({
          questionName: arrayControl.at(6)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(6)['controls'].answer.value === false) {
        arrayControl.setControl(6, this.createIntentionsFixed({
          questionName: arrayControl.at(6)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(7)['controls'].answer.value === true) {
        arrayControl.setControl(7, this.createIntentionsFixed({
          questionName: arrayControl.at(7)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(7)['controls'].answer.value === false) {
        arrayControl.setControl(7, this.createIntentionsFixed({
          questionName: arrayControl.at(7)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(8)['controls'].answer.value === true) {
        arrayControl.setControl(8, this.createIntentionsFixed({
          questionName: arrayControl.at(8)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(8)['controls'].answer.value === false) {
        arrayControl.setControl(8, this.createIntentionsFixed({
          questionName: arrayControl.at(8)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(9)['controls'].answer.value === true) {
        arrayControl.setControl(9, this.createIntentionsFixed({
          questionName: arrayControl.at(9)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(9)['controls'].answer.value === false) {
        arrayControl.setControl(9, this.createIntentionsFixed({
          questionName: arrayControl.at(9)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(10)['controls'].answer.value === true) {
        arrayControl.setControl(10, this.createIntentionsFixed({
          questionName: arrayControl.at(10)['controls'].questionName.value, 'answer': true }));
      }

      if (firstIntention.at(11)['controls'].answer.value === true) {
        arrayControl.setControl(11, this.createIntentionsFixed({
          questionName: arrayControl.at(11)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(11)['controls'].answer.value === false) {
        arrayControl.setControl(11, this.createIntentionsFixed({
          questionName: arrayControl.at(11)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(12)['controls'].answer.value === true) {
        arrayControl.setControl(12, this.createIntentionsFixed({
          questionName: arrayControl.at(12)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(12)['controls'].answer.value === false) {
        arrayControl.setControl(12, this.createIntentionsFixed({
          questionName: arrayControl.at(12)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(13)['controls'].answer.value === true) {
        arrayControl.setControl(13, this.createIntentionsFixed({
          questionName: arrayControl.at(13)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(13)['controls'].answer.value === false) {
        arrayControl.setControl(13, this.createIntentionsFixed({
          questionName: arrayControl.at(13)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(14)['controls'].answer.value === true) {
        arrayControl.setControl(14, this.createIntentionsFixed({
          questionName: arrayControl.at(14)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(14)['controls'].answer.value === false) {
        arrayControl.setControl(14, this.createIntentionsFixed({
          questionName: arrayControl.at(14)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(15)['controls'].answer.value === true) {
        arrayControl.setControl(15, this.createIntentionsFixed({
          questionName: arrayControl.at(15)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(15)['controls'].answer.value === false) {
        arrayControl.setControl(15, this.createIntentionsFixed({
          questionName: arrayControl.at(15)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(16)['controls'].answer.value === true) {
        arrayControl.setControl(16, this.createIntentionsFixed({
          questionName: arrayControl.at(16)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(16)['controls'].answer.value === false) {
        arrayControl.setControl(16, this.createIntentionsFixed({
          questionName: arrayControl.at(16)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(17)['controls'].answer.value === true) {
        arrayControl.setControl(17, this.createIntentionsFixed({
          questionName: arrayControl.at(17)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(17)['controls'].answer.value === false) {
        arrayControl.setControl(17, this.createIntentionsFixed({
          questionName: arrayControl.at(17)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(18)['controls'].answer.value === true) {
        arrayControl.setControl(18, this.createIntentionsFixed({
          questionName: arrayControl.at(18)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(18)['controls'].answer.value === false) {
        arrayControl.setControl(18, this.createIntentionsFixed({
          questionName: arrayControl.at(18)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(19)['controls'].answer.value === true) {
        arrayControl.setControl(19, this.createIntentionsFixed({
          questionName: arrayControl.at(19)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(19)['controls'].answer.value === false) {
        arrayControl.setControl(19, this.createIntentionsFixed({
          questionName: arrayControl.at(19)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(20)['controls'].answer.value === true) {
        arrayControl.setControl(20, this.createIntentionsFixed({
          questionName: arrayControl.at(20)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(20)['controls'].answer.value === false) {
        arrayControl.setControl(20, this.createIntentionsFixed({
          questionName: arrayControl.at(20)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(21)['controls'].answer.value === true) {
        arrayControl.setControl(21, this.createIntentionsFixed({
          questionName: arrayControl.at(21)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(21)['controls'].answer.value === false) {
        arrayControl.setControl(21, this.createIntentionsFixed({
          questionName: arrayControl.at(21)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(22)['controls'].answer.value === true) {
        arrayControl.setControl(22, this.createIntentionsFixed({
          questionName: arrayControl.at(22)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(22)['controls'].answer.value === false) {
        arrayControl.setControl(22, this.createIntentionsFixed({
          questionName: arrayControl.at(22)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(23)['controls'].answer.value === true) {
        arrayControl.setControl(23, this.createIntentionsFixed({
          questionName: arrayControl.at(23)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(23)['controls'].answer.value === false) {
        arrayControl.setControl(23, this.createIntentionsFixed({
          questionName: arrayControl.at(23)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(24)['controls'].answer.value === true) {
        arrayControl.setControl(24, this.createIntentionsFixed({
          questionName: arrayControl.at(24)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(24)['controls'].answer.value === false) {
        arrayControl.setControl(24, this.createIntentionsFixed({
          questionName: arrayControl.at(24)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(25)['controls'].answer.value === true) {
        arrayControl.setControl(25, this.createIntentionsFixed({
          questionName: arrayControl.at(25)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(25)['controls'].answer.value === false) {
        arrayControl.setControl(25, this.createIntentionsFixed({
          questionName: arrayControl.at(25)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(26)['controls'].answer.value === true) {
        arrayControl.setControl(26, this.createIntentionsFixed({
          questionName: arrayControl.at(26)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(26)['controls'].answer.value === false) {
        arrayControl.setControl(26, this.createIntentionsFixed({
          questionName: arrayControl.at(26)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(27)['controls'].answer.value === true) {
        arrayControl.setControl(27, this.createIntentionsFixed({
          questionName: arrayControl.at(27)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(27)['controls'].answer.value === false) {
        arrayControl.setControl(27, this.createIntentionsFixed({
          questionName: arrayControl.at(27)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(28)['controls'].answer.value === true) {
        arrayControl.setControl(28, this.createIntentionsFixed({
          questionName: arrayControl.at(28)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(28)['controls'].answer.value === false) {
        arrayControl.setControl(28, this.createIntentionsFixed({
          questionName: arrayControl.at(28)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(29)['controls'].answer.value === true) {
        arrayControl.setControl(29, this.createIntentionsFixed({
          questionName: arrayControl.at(29)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(29)['controls'].answer.value === false) {
        arrayControl.setControl(29, this.createIntentionsFixed({
          questionName: arrayControl.at(29)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntention.at(30)['controls'].answer.value === true) {
        arrayControl.setControl(30, this.createIntentionsFixed({
          questionName: arrayControl.at(30)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntention.at(30)['controls'].answer.value === false) {
        arrayControl.setControl(30, this.createIntentionsFixed({
          questionName: arrayControl.at(30)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(0)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(0, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(0)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(0)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(0, this.createIntentionsFixed({
          questionName: arrayControl.at(0)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(1)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(1, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(1)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(1)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(1, this.createIntentionsFixed({
          questionName: arrayControl.at(1)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(2)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(2, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(2)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(2)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(2, this.createIntentionsFixed({
          questionName: arrayControl.at(2)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(3)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(3, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(3)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(3)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(3, this.createIntentionsFixed({
          questionName: arrayControl.at(3)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(4)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(4, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(4)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(4)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(4, this.createIntentionsFixed({
          questionName: arrayControl.at(4)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(5)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(5, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(5)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(5)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(5, this.createIntentionsFixed({
          questionName: arrayControl.at(5)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(6)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(6, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(6)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(6)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(6, this.createIntentionsFixed({
          questionName: arrayControl.at(6)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(6)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(6, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(6)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(6)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(6, this.createIntentionsFixed({
          questionName: arrayControl.at(6)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(7)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(7, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(7)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(7)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(7, this.createIntentionsFixed({
          questionName: arrayControl.at(7)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(8)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(8, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(8)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(8)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(8, this.createIntentionsFixed({
          questionName: arrayControl.at(8)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(9)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(9, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(9)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(9)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(9, this.createIntentionsFixed({
          questionName: arrayControl.at(9)['controls'].questionName.value, 'answer': false }));
      }

      if (firstIntentionDynamic.at(10)['controls'].answer.value === true) {
        secondIntentionDynamic.setControl(10, this.createIntentionsFixed({
          questionName: secondIntentionDynamic.at(10)['controls'].questionName.value, 'answer': true }));
      } else if (firstIntentionDynamic.at(10)['controls'].answer.value === false) {
        secondIntentionDynamic.setControl(10, this.createIntentionsFixed({
          questionName: arrayControl.at(10)['controls'].questionName.value, 'answer': false }));
      }
    }
  }


}
