import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  Validators
} from '@angular/forms';
import { Credential, logInData, LoginForm } from 'src/app/interfaces/users.interface';
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
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
    })
})

get isPasswordValid(): string | boolean {
  const control = this.form.get('password');

  const isInvalid = control?.invalid && control.touched;

  if(isInvalid) {
      return control.hasError('required')
      ? 'Contraseña incorrecta'
      : '';
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

// async login() {
//   const isAuthenticated = await this.authService.login(this.form);
//   if (isAuthenticated) {
//     console.log('Inicio de sesión exitoso');
//   } else {
//     console.log('Usuario o contraseña incorrectos');
//   }
//   this.router.navigateByUrl('/home');
// }
login() {
  if (this.form.invalid) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  const loginData: logInData = {
    identifier: this.form.value.email || "", // Puede ser email o teléfono
    password: this.form.value.password || "",
  };

  this.authService.login(loginData).then((success) => {
    if (success) {
      this.router.navigate(['/home']); // Redirigir solo si el login es exitoso
    }
  });
}
}
