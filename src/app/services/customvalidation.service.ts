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

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = /^[0-9]{10}$/.test(control.value);
      return valid ? null : { invalidNumber: true };
    };
  }

  constructor() { }
}
