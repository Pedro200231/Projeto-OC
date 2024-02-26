import { Component } from '@angular/core';
import { TableService } from '../shared/services/table.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  totalCadastros: number = 0;
  cadastrosUltimoMes: number = 0;
  cadastroPendente: number = 0;

  constructor(private tableService: TableService) {}

  getNewUsersLastMonth = (dados: any[]) => {
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    const newUsersLastMonth = dados.filter(dado => {
      const userDate = new Date(dado.dataCadastro);
      return userDate > lastMonth;
    });

    return newUsersLastMonth.length;
  };

  ngOnInit(){
    this.tableService.list().subscribe(dados => {
      this.totalCadastros = dados.length;
      this.cadastrosUltimoMes = this.getNewUsersLastMonth(dados);
      this.cadastroPendente = dados.filter(dado => dado.status === 'Inativo').length;
    });
  }
}
