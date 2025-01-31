import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  Validators
} from '@angular/forms';
import { SingUpForm } from 'src/app/interfaces/users.interface';

@Component({
  standalone: false,
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
 public passwordType: string = 'password';
 public passwordShown: boolean = false;

  constructor() { }

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

    async singUp(): Promise<void> {
        if(this.form.invalid) return;

        // const credential: Credential = {
        //     email: this.form.value.email || "",
        //     password: this.form.value.password || "",
        // }

        // try {
        //     const userCredential = await this.authService.signUpWithEmailAndPassword(credential);
        //     console.log(userCredential);
        //     this._router.navigateByUrl('/');
        // } catch (error) {
        //     console.error(error);
        // }

        // console.log(this.form.value)
    }
}
