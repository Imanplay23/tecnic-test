import { FormControl } from "@angular/forms";



export interface SingUpForm {
  fullNames: FormControl<string>,
  email: FormControl<string>,
  telNumber: FormControl<string>,
  password: FormControl<string>,
  confirmPassword: FormControl<string>,
}

export interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>,
}