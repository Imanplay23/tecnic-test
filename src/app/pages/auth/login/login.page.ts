import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup,
  Validators
} from '@angular/forms';
import { logInData, LoginForm } from 'src/app/interfaces/users.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { NativeBiometric } from 'capacitor-native-biometric';


@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  public passwordType: string = 'password';
  public passwordShown: boolean = false;

  public isIOS = false;
  public enableFastLogin = false;

  formBuilder = inject(FormBuilder);

  constructor(
    private platform: Platform,
    private authService: AuthService, 
    private router: Router, 
    private alertCtrl: AlertController,
  ) { 
    this.isIOS = this.platform.is('ios');
  }

  form: FormGroup<LoginForm> = this.formBuilder.group({
    identifier: this.formBuilder.control('', {
        validators: Validators.required,
        nonNullable: true,
    }),
    password: this.formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
    })
  });

  async ionViewWillEnter(){
    console.log(this.authService.isBiometricEnabled(this.form.value.identifier as string));
    if (await this.authService.isBiometricEnabled(this.form.value.identifier as string)) {
      this.enableFastLogin = true;
    }
  }

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

  get isIdentifierValid(): string | boolean {
    const control = this.form.get('identifier');
    const isInvalid = control?.invalid && control.touched;
    if(isInvalid) {
        return control.hasError('required')
        ? 'Este campo es obligatorio'
        : 'Ingresa un correo o número de teléfono válido';
    }
    return false;
  }

  togglePassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordType = this.passwordShown ? 'text' : 'password';
  }

  async login() {
    if (this.form.invalid) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }
  
    const loginData: logInData = {
      identifier: this.form.value.identifier || "", 
      password: this.form.value.password || "",
    };
  
    const success = await this.authService.login(loginData);
    if (success) {
      await this.router.navigate(['/home']);
      
      const isBiometricEnabled = await this.authService.isBiometricEnabled(loginData.identifier);
      if (!isBiometricEnabled) {
        await this.suggestBiometricAuth(loginData.identifier, loginData.password);
      }
    }
  }


  
  // Autenticacion biometrica

  async suggestBiometricAuth(email: string, password: string) {
    const alert = await this.alertCtrl.create({
      header: 'Activar autenticación biométrica',
      message: '¿Quieres activar el inicio de sesión con biometría?',
      buttons: [
        {
          text: 'No, gracias',
          role: 'cancel',
        },
        {
          text: 'Sí, activar',
          handler: async () => {
            const success = await this.authService.enableBiometricLogin(email, password);
            if (success) {
              await this.alertCtrl.create({
                header: 'Autenticacion biometrica',
                message: 'Autenticacion biometrica activada correctamente.'
              });
            } else {
              await this.alertCtrl.create({
                header: 'Autenticacion biometrica',
                message: 'Eror, no se pudo activar la autenticacion biometrica.'
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async loginWithBiometrics() {
    try {
      const result = await NativeBiometric.isAvailable();
      if (!result.isAvailable) {
        alert('La autenticación biométrica no está disponible en este dispositivo.');
        return;
      }

      const credentials = await this.authService.getBiometricCredentials();
      if (!credentials) {
        alert('No se encontraron credenciales guardadas.');
        this.enableFastLogin = true;
        return;
      }

      try {
          await NativeBiometric.verifyIdentity({
          reason: 'Iniciar sesion',
          title: 'Autenticacion biometrica',
          description: 'Usa la autenticacion biometrica para iniciar sesion',
          negativeButtonText: 'Cancelar',
        })
      } catch (error) {
        console.log(error);
        return;
      }

      const success = await this.authService.login(credentials);
      if (success) {
        await this.router.navigate(['/home']);
      } else {
        alert('No se pudo autenticar con biometría.');
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      alert('No se pudo autenticar con biometría.');
    }

  }
}
