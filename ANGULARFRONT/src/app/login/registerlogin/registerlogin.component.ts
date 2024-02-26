import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterloginService } from '../../shared/services/registerlogin.service';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';

@Component({
  selector: 'app-registerlogin',
  templateUrl: './registerlogin.component.html',
  styleUrl: './registerlogin.component.css'
})
export class RegisterloginComponent implements OnInit {
  form!: FormGroup;
  error: string | null = null;


  constructor( private router: Router, private RegisterloginService: RegisterloginService, private snackbar: SnackbarComponent) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      senha2: new FormControl(null, [Validators.required]),
    }, { validators: this.confirmarSenhaValidator });
  }

  confirmarSenhaValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const senha2 = control.get('senha2')?.value;

    return password === senha2 ? null : { senhasNaoCorrespondem: true };
  }


  cadastrar() {
    if (this.form.valid) {
      this.RegisterloginService.cadastrar(this.form.value).subscribe({
        next: () => {
          this.snackbar.snackbarMessage("Usuario cadastrado com sucesso!");

            this.router.navigate(['/login']);

        },
        error: (error: any) => {
          this.snackbar.snackbarMessage(error.error.message, true);
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.cadastrar();
      this.error = null;
    }
  }
}
