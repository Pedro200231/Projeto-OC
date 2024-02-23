import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Usuario } from '../shared/interfaces/usuario';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  form!: FormGroup;
  error: string | null = null;
  loginError: string | null = null;
  hidePassword: boolean = true;


  public usuario: Usuario = {} as Usuario;

  constructor(private AuthService: AuthService, private router: Router, private snackbar: SnackbarComponent) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  fazerLogin() {
    this.loginError = null;
    this.usuario = this.form.value;

    if (this.form.valid) {
      this.AuthService.fazerLogin(this.usuario).subscribe({
        next: (users) => {
          sessionStorage.setItem('userName', users.name);
          sessionStorage.setItem('userId', users.userId);
          sessionStorage.setItem('token', users.token);

          this.snackbar.snackbarMessage("Login realizado com sucesso!");

          this.router.navigate(['home']);

          this.error = null;
        },
        error: (error: any) => {
          this.form.controls['email']?.setErrors({ 'incorrect': true });
          this.form.controls['password']?.setErrors({ 'incorrect': true });
          this.loginError = 'Usuário ou senha inválidos';
          this.error = error;
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.fazerLogin();
      this.form.reset();
      this.error = null;
    }
  }
}

