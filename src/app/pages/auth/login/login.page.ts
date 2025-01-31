import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>,
}

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  hide: boolean = true

  formBuilder = inject(FormBuilder);

  constructor() { }

  form: FormGroup<LoginForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
    }),
    password: this.formBuilder.control('', {
        validators: Validators.required,
        nonNullable: true,
    })
})

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

async logIn(): Promise<void> {
    if(this.form.invalid) return;
    
    // const credential: Credential = {
    //     email: this.form.value.email || "",
    //     password: this.form.value.password || "",
    // }
    // try {
    //     const userCredential = await this.authService.logInWithEmailAndPassword(credential);
    //     console.log(userCredential);
    //     this._router.navigateByUrl('/');
    // } catch (error) {
    //     console.error(error)
    // }
}
}
