import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { CaseService } from "../../services/case.service";
declare var $: any;
import "datatables.net";
import "datatables.net-bs4";

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-edit-case",
  templateUrl: "./edit-case.component.html",
  styleUrls: ["./edit-case.component.css"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "ja-JP" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class EditCaseComponent implements OnInit, AfterViewInit {
  formaD: string = "yyyy/MM/dd";
  dateNow: Date = new Date();
  dateNowISO = this.dateNow.toISOString();

  status = ["商談中", "商談中断中", "失注", "受注", "失効", "解約"];
  gender = ["男", "女"];
  month = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ];
  data: any = {
    id: "",
    name: "",
    status: "",
    salesPersonName: "",
    userId: "",
    createdAt: "",
    salesPerson: "",
    clientInformation: [
      {
        clientName: "",
        corporateName: "",
        location: "",
        phone: "",
        industry: "",
        settlementMonth: "",
        enrolledInsurance: "",
        representativeName: "",
        representativeNameCeo: "",
        representativeBirthday: "",
        representativePersonSex: ""
      }
    ],
    officer: [
      {
        officerName: "",
        officerNickName: "",
        officierBirthday: "",
        offcierSex: "",
        officierPosition: "",
        officerRelationWithReprentative: ""
      }
    ],
    firstIntentionsFixed: [
      {
        questionName: "",
        answer: ""
      }
    ],
    intentionsDaynamic: [
      {
        questionName: "",
        answer: ""
      }
    ],
    secondIntentionsDaynamic: [
      {
        questionName: "",
        answer: ""
      }
    ],
    secondInterviewContentFixed: [
      {
        questionName: "",
        answer: ""
      }
    ],

    differentBetween: [
      {
        different: ""
      }
    ],
    othernotes: [
      {
        different: ""
      }
    ],
    negotiationHistory: [
      {
        number: "",
        content: "",
        location: "",
        numberOfAttendant: ""
      }
    ],
    provisionRecord: [
      {
        productName: "",
        materials: "",
        reasonOfSelection: "",
        date: "",
        contract: "",
        action: ""
      }
    ]
  };
  id;
  dataValue;
  jsonObj: any;
  case: Object;
  sales$: Object;
  myForm: FormGroup;
  clientInformation: FormArray;
  officer: FormArray;
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

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private datas: CaseService
  ) {
    this.route.params.subscribe(params => {
      this.case = params.id;
      console.log(this.case, "id");
    });
    this.id = this.case;

    const id = this.cookieService.get("id");
  }

  userId = this.cookieService.get("id");

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      id: "",
      name: "",
      status: "",
      salesPersonName: "",
      createdAt: "",
      salesPerson: "",
      userId: this.userId,
      clientInformation: this.formBuilder.array([
        this.createClientInformation(null)
      ]),
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
    });

    this.http.get(environment.baseUrl + "/sales-person").subscribe(data => {
      this.sales$ = data;
    });

    this.datas.getCaseDetails(this.id).subscribe(data => {
      this.case = data;
      this.dataValue = JSON.stringify(this.case);
      this.jsonObj = JSON.parse(this.dataValue);

      const client = this.jsonObj.clientInformation;
      const ic = this.jsonObj.interviewContent;
      const icGrou = {};

      for (const itm of ic) {
        const key = this.smalize(itm.entity);
        if (!(key in this.jsonObj)) {
          this.jsonObj[key] = [];
        }
        this.jsonObj[key].push(itm);
      }

      const intentionDate = this.jsonObj.intentionDate;
      const intDate = this.jsonObj.intentionDate;
      const intDateGrou = {};

      for (const itm of intDate) {
        const key = this.smalize(itm.entity);
        if (!(key in this.jsonObj)) {
          this.jsonObj[key] = [];
        }
        this.jsonObj[key].push(itm);
      }

      const diffAndNote = this.jsonObj.differentInitialAndFinal;
      const diffAndNoteGrou = {};
      for (const itm of diffAndNote) {
        const key = this.smalize(itm.entity);
        if (!(key in this.jsonObj)) {
          this.jsonObj[key] = [];
        }
        this.jsonObj[key].push(itm);
      }

      this.myForm.get("name").setValue(this.jsonObj.name);
      this.myForm.get("status").setValue(this.jsonObj.status);
      this.myForm.get("salesPersonName").setValue(this.jsonObj.salesPersonName);

      this.myForm
        .get("clientInformation")
        .get("0")
        .get("clientName")
        .setValue(this.jsonObj.clientInformation.clientName);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("corporateName")
        .setValue(this.jsonObj.clientInformation.corporateName);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("location")
        .setValue(this.jsonObj.clientInformation.location);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("phone")
        .setValue(this.jsonObj.clientInformation.phone);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("industry")
        .setValue(this.jsonObj.clientInformation.industry);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("settlementMonth")
        .setValue(this.jsonObj.clientInformation.settlementMonth);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("enrolledInsurance")
        .setValue(this.jsonObj.clientInformation.enrolledInsurance);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("representativeName")
        .setValue(this.jsonObj.clientInformation.representativeName);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("representativeNameCeo")
        .setValue(this.jsonObj.clientInformation.representativeNameCeo);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("representativeBirthday")
        .setValue(this.jsonObj.clientInformation.representativeBirthday);
      this.myForm
        .get("clientInformation")
        .get("0")
        .get("representativePersonSex")
        .setValue(this.jsonObj.clientInformation.representativePersonSex);

      const officerItem = this.myForm.get("officer") as FormArray;
      for (let i = 0; i < this.jsonObj.officer.length; i++) {
        officerItem.push(this.createOfficer(this.jsonObj.officer[i]));
      }

      const firstIntDate = this.myForm.get("firstIntentionDate") as FormArray;
      for (let i = 0; i < this.jsonObj.firstIntentionDate.length; i++) {
        firstIntDate.push(
          this.createFirstIntentionDate(this.jsonObj.firstIntentionDate[i])
        );
      }

      const secondIntDate = this.myForm.get("secondIntentionDate") as FormArray;
      for (let i = 0; i < this.jsonObj.secondIntentionDate.length; i++) {
        secondIntDate.push(
          this.createSecondIntentionDate(this.jsonObj.secondIntentionDate[i])
        );
      }

      const firstIntFixed = this.myForm.get(
        "firstIntentionsFixed"
      ) as FormArray;
      for (let i = 0; i < this.jsonObj.firstIntentionsFixed.length; i++) {
        firstIntFixed.push(
          this.createFirstInterviewContentFixed(
            this.jsonObj.firstIntentionsFixed[i]
          )
        );
      }

      const firstIntDaynamic = this.myForm.get(
        "intentionsDaynamic"
      ) as FormArray;
      for (let i = 0; i < this.jsonObj.intentionsDaynamic.length; i++) {
        firstIntDaynamic.push(
          this.createFirstInterviewContentDaynamic(
            this.jsonObj.intentionsDaynamic[i]
          )
        );
        console.log("Dynamic Question", firstIntDaynamic.at(i));
      }

      const secondIntFixed = this.myForm.get(
        "secondIntentionsFixed"
      ) as FormArray;
      for (let i = 0; i < this.jsonObj.secondIntentionsFixed.length; i++) {
        secondIntFixed.push(
          this.createSecondInterviewContentFixed(
            this.jsonObj.secondIntentionsFixed[i]
          )
        );
      }

      const secondIntDaynamic = this.myForm.get(
        "secondIntentionsDaynamic"
      ) as FormArray;
      for (let i = 0; i < this.jsonObj.secondIntentionsDaynamic.length; i++) {
        secondIntDaynamic.push(
          this.createSecondInterviewContentDaynamic(
            this.jsonObj.secondIntentionsDaynamic[i]
          )
        );
      }

      const othernotes = this.myForm.get("othernotes") as FormArray;
      for (let i = 0; i < this.jsonObj.othernotes.length; i++) {
        othernotes.push(this.createOthernotes(this.jsonObj.othernotes[i]));
      }

      const differentBetween = this.myForm.get("differentBetween") as FormArray;
      for (let i = 0; i < this.jsonObj.differentBetween.length; i++) {
        differentBetween.push(
          this.createDifferentBetween(this.jsonObj.differentBetween[i])
        );
      }

      const negotiationHistory = this.myForm.get(
        "negotiationHistory"
      ) as FormArray;
      for (let i = 0; i < this.jsonObj.negotiationHistory.length; i++) {
        negotiationHistory.push(
          this.createNegotiationHistory(this.jsonObj.negotiationHistory[i])
        );
      }

      const provisionRecord = this.myForm.get("provisionRecord") as FormArray;
      for (let i = 0; i < this.jsonObj.provisionRecord.length; i++) {
        provisionRecord.push(
          this.createProvisionRecord(this.jsonObj.provisionRecord[i])
        );
      }
    });
  }

  smalize(s) {
    return s && s[0].toLowerCase() + s.slice(1);
  }

  createClientInformation(params: any) {
    return this.formBuilder.group({
      clientName: params != null ? params.clientName : "",
      corporateName: params != null ? params.corporateName : "",
      location: params != null ? params.location : "",
      phone: params != null ? params.phone : "",
      industry: params != null ? params.industry : "",
      settlementMonth: params != null ? params.settlementMonth : "",
      enrolledInsurance: params != null ? params.enrolledInsurance : "",
      representativeName: params != null ? params.representativeName : "",
      representativeNameCeo: params != null ? params.representativeNameCeo : "",
      representativeBirthday:
        params != null ? params.representativeBirthday : "",
      representativePersonSex:
        params != null ? params.representativePersonSex : ""
    });
  }

  createOfficer(valu: any) {
    return this.formBuilder.group({
      officerName: valu != null ? valu.officerName : "",
      officerNickName: valu != null ? valu.officerNickName : "",
      officierBirthday: valu != null ? valu.officierBirthday : "",
      offcierSex: valu != null ? valu.offcierSex : "",
      officierPosition: valu != null ? valu.officierPosition : "",
      officerRelationWithReprentative:
        valu != null ? valu.officerRelationWithReprentative : ""
    });
  }

  createFirstIntentionDate(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : "",
      intentionDate: val != null ? val.intentionDate : "",
      entity: val != null ? val.entity : ""
    });
  }

  createSecondIntentionDate(val: any) {
    return this.formBuilder.group({
      id: val != null ? val.id : "",
      intentionDate: val != null ? val.intentionDate : "",
      entity: val != null ? val.entity : ""
    });
  }

  createFirstInterviewContentDaynamic(valu: any) {
    return this.formBuilder.group({
      questionName: valu != null ? valu.question : "",
      answer: valu != null ? valu.answer : ""
    });
  }

  createFirstInterviewContentFixed(val: any) {
    return this.formBuilder.group({
      questionName: val != null ? val.question : "",
      answer: val != null ? val.answer : ""
    });
  }

  createSecondInterviewContentDaynamic(val: any) {
    return this.formBuilder.group({
      questionName: val != null ? val.question : "",
      answer: val != null ? val.answer : ""
    });
  }

  createSecondInterviewContentFixed(val: any) {
    return this.formBuilder.group({
      questionName: val != null ? val.question : "",
      answer: val != null ? val.answer : ""
    });
  }

  createDifferentBetween(val: any) {
    return this.formBuilder.group({
      different: val != null ? val.different : ""
    });
  }

  createOthernotes(val: any) {
    return this.formBuilder.group({
      different: val != null ? val.different : ""
    });
  }

  createNegotiationHistory(val: any) {
    return this.formBuilder.group({
      number: val != null ? val.number : "",
      content: val != null ? val.content : "",
      location: val != null ? val.location : "",
      numberOfAttendant: val != null ? val.numberOfAttendant : ""
    });
  }

  createProvisionRecord(val: any) {
    return this.formBuilder.group({
      productName: val != null ? val.productName : "",
      materials: val != null ? val.materials : "",
      reasonOfSelection: val != null ? val.reasonOfSelection : "",
      date: val != null ? val.date : "",
      contract: val != null ? val.contract : "",
      action: val != null ? val.action : ""
    });
  }

  addFirstInterviewContentDaynamic(): void {
    this.intentionsDaynamic = this.myForm.get(
      "intentionsDaynamic"
    ) as FormArray;
  }

  addSecondInterviewContentDaynamic(): void {
    this.secondIntentionsDaynamic = this.myForm.get(
      "secondIntentionsDaynamic"
    ) as FormArray;
  }

  addNegotiationHistory(): void {
    this.negotiationHistory = this.myForm.get(
      "negotiationHistory"
    ) as FormArray;
  }

  addProvisionRecord(): void {
    this.provisionRecord = this.myForm.get("provisionRecord") as FormArray;
  }
  ngAfterViewInit() {
    this.datas.getCaseDetails(this.id).subscribe(data => {
      this.case = data;
      $(document).ready(function() {
        $("#caseTable").DataTable({
          dom: "Bfrtip",
          searching: false,
          paging: false,
          bInfo: false,
          buttons: [
            {
              extend: "csv",
              text: "CSV",
              charset: "UTF-16BE",
              orientation: "portrait",
              bom: true
            },
            {
              extend: "excel",
              text: "Excel"
            }
          ],
          ordering: false
        });
      });
    });
  }
}
