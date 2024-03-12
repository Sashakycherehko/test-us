import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'test-us';
  passwordStrength: string = 'empty';
  passwordForm = new FormControl('', [
    Validators.minLength(8),
    Validators.maxLength(16),
    Validators.required,
    this.customLetterCheck,
    this.customNumberCheck,
    this.customSymbolsCheck,
  ]);

  ngOnInit(): void {
    this.passwordForm.valueChanges.subscribe((value) => {
      this.controller(this.passwordForm);
    });
  }

  protected controller(control: AbstractControl): void {
    const isMinLength = !control.getError('minlength');
    const isRequired = !control.getError('required');
    const isLetter = !control.getError('missingLetter');
    const isNumber = !control.getError('missingNumber');
    const isSymbol = !control.getError('missingSymbol');

    if (!isMinLength) {
      this.passwordStrength = 'red';
    } else if (isLetter && isNumber && isSymbol) {
      this.passwordStrength = 'green';
    } else if (
      (isLetter && isNumber) ||
      (isLetter && isSymbol) ||
      (isNumber && isSymbol)
    ) {
      this.passwordStrength = 'yellow';
    } else {
      this.passwordStrength = 'red';
    }
  }

  protected customLetterCheck(
    control: AbstractControl
  ): ValidationErrors | null {
    const letterCheck: boolean = /^(?=.*[A-Za-z])/.test(control.value);

    return letterCheck
      ? null
      : {
          missingLetter: {
            message: 'missing letter',
            value: control.value,
          },
        };
  }

  protected customNumberCheck(
    control: AbstractControl
  ): ValidationErrors | null {
    const numberCheck: boolean = /^(?=.*[0-9])/.test(control.value);
    return numberCheck
      ? null
      : {
          missingNumber: { message: 'missing number', value: control.value },
        };
  }

  protected customSymbolsCheck(
    control: AbstractControl
  ): ValidationErrors | null {
    const symbolCheck: boolean = /.*[^a-zA-Z0-9].*/.test(control.value);
    return symbolCheck
      ? null
      : {
          missingSymbol: { message: 'missing symbol', value: control.value },
        };
  }
}
