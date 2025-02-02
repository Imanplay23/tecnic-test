import { Component, inject } from '@angular/core';
import { 
  AbstractControl,
  FormBuilder, 
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { SingUpForm } from 'src/app/interfaces/users.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
 public passwordType: string = 'password';
 public passwordShown: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

    formBuilder = inject(FormBuilder);

    form: FormGroup<SingUpForm> = this.formBuilder.group({
        fullNames: this.formBuilder.control('', {
            validators: Validators.required,
            nonNullable: true,
        }),
        email: this.formBuilder.control('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
        }),
        telNumber: this.formBuilder.control('', {
          nonNullable: true,
      }),
        password: this.formBuilder.control('', {
            validators: [Validators.required, Validators.minLength(6),],
            nonNullable: true,
        }),
        confirmPassword: this.formBuilder.control('', {
          validators: Validators.required,
          nonNullable: true,
      }),
    });

    // passwordValidator(control: AbstractControl): ValidationErrors | null {
    //   const value: string = control.value;
    //   if (!/[0-9]/.test(value)) {
    //     return { passwordWeak: true };
    //   }
    //   return null;
    // }

    matchPasswords(group: FormGroup): ValidationErrors | null {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    }

    get isPasswordValid(): string | boolean {
      const control = this.form.get('password');

      const isInvalid = control?.invalid && control.touched;

      if(isInvalid) {
          return control.hasError('required')
          ? 'La contraseña es obligatoria'
          : 'Debe tener al menos 6 caracteres';
      }
      return false;
  }

    get isEmailValid(): string | boolean {
        const control = this.form.get('email');

        const isInvalid = control?.invalid && control.touched;

        if(isInvalid) {
            return control.hasError('required')
            ? 'This field is required'
            : 'Enter a valid email';
        }
        return false;
    }

    togglePassword() {
      if (this.passwordShown) {
        this.passwordShown = false;
        this.passwordType = 'password';
      } else {
        this.passwordShown = true;
        this.passwordType = 'text';
      }
    }

    async signUp() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      try {
        await this.authService.registerUser(this.form);
        console.log('Usuario registrado con éxito');
        this.router.navigateByUrl('/home')
      } catch (error) {
        console.error(error);
      }
    }
}
