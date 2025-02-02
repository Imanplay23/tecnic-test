import { Injectable } from '@angular/core';
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

    alert('¡Inicio de sesión exitoso!');
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
}

  // async login(loginForm: FormGroup<LoginForm>) {
  //   if (loginForm.invalid) return false;

  //   let users = await this._storage?.get('users') || [];

  //   const { email, password } = loginForm.value;

  //   return users.some(
  //     (user: any) =>
  //       (user.email === email || user.telNumber === email) &&
  //       user.password === password
  //   );
  // }