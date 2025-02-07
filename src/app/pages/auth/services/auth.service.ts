import { Injectable } from '@angular/core';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';
import { SingUpForm, logInData } from 'src/app/interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;
  private USERS_KEY = 'users';

  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async registerUser(signUpForm: FormGroup<SingUpForm>) {
    if (signUpForm.invalid) return;

    let users = await this._storage?.get(this.USERS_KEY) || [];

    const { fullNames, email, telNumber, password, confirmPassword, profilePhoto } = signUpForm.value;

    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const userExists = users.some(
      (u: any) => u.email === email || u.telNumber === telNumber
    );

    if (userExists) {
      throw new Error('El email o número de teléfono ya está registrado.');
    }

    users.push({ fullNames, email, telNumber, password, profilePhoto });

    await this._storage?.set(this.USERS_KEY, users);
  }

  /*  async login(loginForm: FormGroup<LoginForm>) {
    if (loginForm.invalid) return false;

    let users = await this._storage?.get('users') || [];

    const { email, password } = loginForm.value;

    return users.some(
      (user: any) =>
        (user.email === email || user.telNumber === email) &&
        user.password === password
    );
  }  */

  async login(loginData: logInData): Promise<boolean> {
    
    const users = (await this._storage?.get(this.USERS_KEY)) || [];
    console.log('Usuarios en Storage:', users);

    const user = users.find(
      (u: any) => u.email === loginData.identifier || u.telNumber === loginData.identifier
    );
  
    if (!user) {
      alert('Usuario no encontrado');
      return false;
    }
  
    if (user.password !== loginData.password) {
      alert('Contraseña incorrecta');
      return false;
    }
    
    await this._storage?.set('loggedInUser', user.email);
    console.log('Usuario logueado guardado en Storage:', user.email);

    return true;
  } 

  async getCurrentUser() {
    const loggedInEmail = await this._storage?.get('loggedInUser');
    console.log('Email del usuario logueado en Storage:', loggedInEmail);
  
    if (!loggedInEmail) return null;
  
    const users = (await this._storage?.get(this.USERS_KEY)) || [];
    console.log('Usuarios guardados:', users);
  
    const currentUser = users.find((user: any) => user.email === loggedInEmail);
    console.log('Usuario obtenido en getCurrentUser:', currentUser);
  
    return currentUser || null;
  }

  async logout() {
    await this._storage?.remove('loggedInUser');
  }

  // autenticacion biometrica

  async enableBiometricLogin(identifier: string, password: string) {
    try {
      const isAvailable = await NativeBiometric.isAvailable();
      if (!isAvailable.isAvailable) {
        console.log('Autenticación biométrica no disponible en este dispositivo.');
        return false;
      }
  
      // Guardar credenciales en biometría
      await NativeBiometric.setCredentials({
        username: identifier, // Usar el identificador (email o teléfono)
        password: password,
        server: 'app.auth',
      });
  
      await NativeBiometric.verifyIdentity({
        reason: 'Iniciar sesion',
        title: 'Autenticacion biometrica',
        description: 'Usa la autenticacion biometrica para iniciar sesion',
        negativeButtonText: 'Cancelar',
      });
  
      // Guardar en almacenamiento local que este usuario activó biometría
      let biometricUsers = (await this.storage.get('biometricUsers')) || [];
      if (!biometricUsers.includes(identifier)) {
        biometricUsers.push(identifier);
        await this.storage.set('biometricUsers', biometricUsers);
      }
  
      console.log(`Autenticación biométrica activada para: ${identifier}`);
      return true;
    } catch (error) {
      console.error('Error al activar biometría:', error);
      return false;
    }
  }

  async getBiometricCredentials() {
    try {
      const result = await NativeBiometric.getCredentials({ server: 'app.auth' });

      if (!result.username || !result.password) {
        console.log('No se encontraron credenciales guardadas.');
        return null;
      }

      return {
        identifier: result.username,
        password: result.password,
      };
    } catch (error) {
      console.error('Error al obtener credenciales biométricas:', error);
      return null;
    }
  }

async isBiometricEnabled(identifier: string): Promise<boolean> {
  const biometricUsers = (await this.storage.get('biometricUsers')) || [];
  return biometricUsers.includes(identifier);
}
}