import { Directive, Input } from "@angular/core";
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";

@Directive({
  selector: "[appInputNumberValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InputNumberValidatorDirective,
      multi: true
    }
  ]
})
export class InputNumberValidatorDirective implements Validator {
  @Input("appInputNumberValidator") number: number;
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    return isNaN(this.number) ? { isNotNumber: true } : { isNotNumber: false };
  }
}
