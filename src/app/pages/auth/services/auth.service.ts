import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';
import { SingUpForm, LoginForm, logInData } from 'src/app/interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;
  private USERS_KEY = 'users';

  constructor(private storage: Storage) { 
    this.init()
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async registerUser(signUpForm: FormGroup<SingUpForm>) {
    if (signUpForm.invalid) return;

    let users = await this._storage?.get('users') || [];

    const { fullNames, email, telNumber, password, confirmPassword } = signUpForm.value;

    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const userExists = users.some(
      (u: any) => u.email === email || u.telNumber === telNumber
    );

    if (userExists) {
      throw new Error('El email o número de teléfono ya está registrado.');
    }

    users.push({ fullNames, email, telNumber, password });

    await this._storage?.set('users', users);
  }

  async login(loginData: logInData): Promise<boolean> {
    const users = (await this._storage?.get(this.USERS_KEY)) || [];
  
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
  
    alert('¡Inicio de sesión exitoso!');
    return true;
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
}
