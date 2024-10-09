import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl , ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  requiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value ? null : { required: true };
    };
  }

  constructor() { }
}
