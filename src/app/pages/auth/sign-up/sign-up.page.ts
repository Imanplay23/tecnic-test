import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  Validators
} from '@angular/forms';
import { Credential, SignUpData, SingUpForm } from 'src/app/interfaces/users.interface';
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
          validators: Validators.required,
          nonNullable: true,
      }),
        password: this.formBuilder.control('', {
            validators: Validators.required,
            nonNullable: true,
        }),
        confirmPassword: this.formBuilder.control('', {
          validators: Validators.required,
          nonNullable: true,
      }),
    });


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
      try {
        await this.authService.registerUser(this.form);
        console.log('Usuario registrado con éxito');
        this.router.navigateByUrl('/home')
      } catch (error) {
        console.error(error);
      }
    }
}
