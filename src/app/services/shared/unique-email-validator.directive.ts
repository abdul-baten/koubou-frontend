import { Directive } from '@angular/core';
import {SalesPersonService} from '../sales-person.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';

export function uniqueEmailValidator(salesPersonService: SalesPersonService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    /*console.log(c.value);*/
    return salesPersonService.getUsersByEmail(c.value).pipe(
      map(users => {
        /*console.log(users.length);
        console.log(typeof users);
        console.log(users);*/
        return users && users.length > 0 ? { 'appUniqueEmailValidator': true } : null;
      })
    );
  };
}

@Directive({
  selector: '[appUniqueEmailValidator]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueEmailValidatorDirective, multi: true}]
})
export class UniqueEmailValidatorDirective implements AsyncValidator {

  constructor(private salesPersonService: SalesPersonService) { }

  validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniqueEmailValidator(this.salesPersonService)(c);
  }

}
