import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAutenticado: boolean = false;
  constructor(private router: Router, private http: HttpClient, private snackbar: SnackbarComponent) { }

  fazerLogin(usuario: Usuario): Observable<any> {
    return this.http.post<Usuario>(`${environment.API}Users/login`, usuario)
  }

  fazerLogout() {
    sessionStorage.clear();
    this.snackbar.snackbarMessage("Logout realizado com sucesso!");
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 2000);



  }

   verificaUsuarioAutenticado(): boolean {
    if (sessionStorage.getItem('token') === 'seu_token_de_autenticacao') {
      this.usuarioAutenticado = true;
      return this.usuarioAutenticado;
    }
    return false;
  }
}
