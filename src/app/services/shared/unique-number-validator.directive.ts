import { Directive } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import {SalesPersonService} from '../sales-person.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, NG_ASYNC_VALIDATORS, ValidationErrors, Validators,
  AsyncValidatorFn } from '@angular/forms';

export function uniqueNumberValidator(salesPersonService: SalesPersonService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    /*console.log(c.value);*/
    return salesPersonService.getUsersByNumber(c.value).pipe(
      map(users => {
        /*console.log(users.length);
         console.log(typeof users);
         console.log(users);*/
        return users && users.length > 0 ? { 'appUniqueNumberValidator': true } : null;
      })
    );
  };
}

@Directive({
  selector: '[appUniqueNumberValidator]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueNumberValidatorDirective, multi: true}]
})


export class UniqueNumberValidatorDirective implements AsyncValidator {

  constructor(private salesPersonService: SalesPersonService) { }

  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniqueNumberValidator(this.salesPersonService)(c);
  }

}
