import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  Validators
} from '@angular/forms';
import { Credential, LoginForm } from 'src/app/interfaces/users.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  hide: boolean = true

  formBuilder = inject(FormBuilder);

  constructor(private authService: AuthService, private router: Router) { }

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

async login() {
  const isAuthenticated = await this.authService.login(this.form);
  if (isAuthenticated) {
    console.log('Inicio de sesión exitoso');
  } else {
    console.log('Usuario o contraseña incorrectos');
  }
  this.router.navigateByUrl('/home');
}
}
