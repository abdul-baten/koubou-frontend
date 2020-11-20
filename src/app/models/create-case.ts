export class CreateCase {

    constructor(
        public id: number,
        public name: String,
        public status: String,
        public salesPersonName: String,
        public userId: String,
        public clientName: String,
        public corporateName: String,
        public location: String,
        public phone: String,
        public industry: String,
        public settlementMonth: String,
        public enrolledInsurance: String,
        public representativeName: String,
        public representativeNameCeo: String,
        public representativeBirthday: String,
        public representativePersonSex: String,

        public officerName: String [],
        public officerNickName: String [],
        public officierBirthday: String [],
        public offcierSex: String [],
        public officierPosition: String [],
        public officerRelationWithReprentative: String []
    
    ) {
     
       }
}
