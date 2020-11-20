export class Company {
  /*public id: number;
  public companyName: string;
  public location: string;
  public phone: number;
  public websiteLink: string;
  public suppliersComapanyName: string;
  public suppliersDepartmentName: string;
  public suppliersLocation: string;
  public suppliersPhone: number;
  public suppliersRepresentative: string;*/

  constructor(public id: number,
   public companyName: String,
   public location: String,
   public phone: string,
   public websiteLink: string,
   public companyNameArray: string [],
   public departmentArray: string [],
   public locationArray: string [],
   public phoneNumberArray: string [] ) {

  }
}
