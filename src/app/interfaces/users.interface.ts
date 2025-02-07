import { FormControl } from "@angular/forms";



export interface SingUpForm {
  fullNames: FormControl<string>,
  email: FormControl<string>,
  telNumber: FormControl<string>,
  password: FormControl<string>,
  confirmPassword: FormControl<string>,
  profilePhoto: FormControl<string | null>,
}

export interface LoginForm {
  identifier: FormControl<any>,
  password: FormControl<string>,
}

export interface Credential {
  email: string,
  password: string,
}

export interface SignUpData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export interface logInData {
  identifier: string,
  password: string,
}