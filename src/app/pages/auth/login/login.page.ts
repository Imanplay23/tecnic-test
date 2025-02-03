import { Component, inject, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  Validators
} from '@angular/forms';
import { logInData, LoginForm } from 'src/app/interfaces/users.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isBiometricAvailable: boolean = false;
  platformIcon: string = 'finger-print';

  formBuilder = inject(FormBuilder);

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {}

  form: FormGroup<LoginForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    })
  });

  ngOnInit() {
    this.checkBiometricAvailability();
    this.setPlatformIcon();
  }

  async checkBiometricAvailability() {
    this.isBiometricAvailable = await this.authService.isBiometricAvailable();
  }

  setPlatformIcon() {
    if (this.platform.is('ios')) {
      this.platformIcon = 'lock-open-outline'; 
    } else if (this.platform.is('android')) {
      this.platformIcon = 'finger-print'; 
    }
  }

  get isPasswordValid(): string | boolean {
    const control = this.form.get('password');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'Contraseña incorrecta'
        : '';
    }
    return false;
  }

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'Este campo es obligatorio'
        : 'Ingresa un email válido';
    }
    return false;
  }

  login() {
    if (this.form.invalid) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    const loginData: logInData = {
      identifier: this.form.value.email || "",
      password: this.form.value.password || "",
    };

    this.authService.login(loginData).then(async (success) => {
      if (success) {
        if (this.isBiometricAvailable) {
          const saveBiometric = confirm('¿Quieres habilitar el inicio de sesión con huella?');
          if (saveBiometric) {
            await this.authService.enableBiometricLogin(loginData.identifier, loginData.password);
          }
        }
        this.router.navigate(['/home']);
      }
    });
  }

  async quickLogin() {
    const success = await this.authService.quickLogin();
    if (success) {
      this.router.navigate(['/home']);
    } else {
      alert('No se pudo iniciar sesión con autenticación biométrica.');
    }
  }
}
