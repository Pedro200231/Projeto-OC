import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';
import { InsideformService } from '../../shared/services/inside-form.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {

  form!: FormGroup;
  error: string | null = null;
  userId = sessionStorage.getItem('userId')
  titulo: string = 'Novo Cadastro';
  botao: string = 'Cadastrar';
  insiderUserId?: number;

  constructor(private router: Router, private InsideformService: InsideformService, private snackbar: SnackbarComponent, private activatedRoute: ActivatedRoute, private modalService: InsideformService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.insiderUserId = params['id'];
        if (this.insiderUserId) {
          this.titulo = 'Editar Cadastro';
          this.botao = 'Salvar';
          if (this.userId) {
            this.modalService.edit(this.insiderUserId, Number(this.userId)).subscribe({
              next: (data) => {
                this.form.patchValue(data);
                this.form.get('status')?.setValue(data.status === 'Ativo' ? true : false);
              },
              error: (error: any) => {
                this.snackbar.snackbarMessage('Cadastro não encontrado', error);
                this.router.navigate(['/register']);
              }
            });
          }

        }
      }
    });



    this.form = new FormGroup({
      userId: new FormControl(this.userId),
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      idade: new FormControl(null, [Validators.required, Validators.min(18), Validators.max(120)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)]),
      endereco: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      status: new FormControl(true, [Validators.required]),
      interesses: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      curiosidades: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      valores: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    });
  }

  toggleChanged(event: any) {
    this.form.get('status')?.setValue(event.checked);
  }

  cadastrarinterno() {
    this.InsideformService.cadastrarinterno(this.form.value).subscribe({
      next: () => {
        this.snackbar.snackbarMessage("Usuario cadastrado com sucesso!");
        this.router.navigate(['/register']);
      },
      error: (error: any) => {
        this.snackbar.snackbarMessage(error.error.message, true);
      }
    });
  }
  saveEditedUser() {
    let editedForm = this.form.value;
    editedForm.status = this.form.value.status ? 'Ativo' : 'Inativo';
    this.modalService.saveEdit(this.insiderUserId, editedForm).subscribe({
      next: () => {
        this.snackbar.snackbarMessage("Dados editados com sucesso!");
        this.router.navigate(['/register']);
      },
      error: (error) => {
        this.snackbar.snackbarMessage(error.error.message, error);
      }
    });


  }

  onSubmit() {
    if (this.form.valid) {
      if (this.insiderUserId) {
        this.saveEditedUser();
      } else {
        this.cadastrarinterno();
      }
    }

  }

}
