import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Logs } from '../../interfaces/logs';
import { TableService } from '../../services/table.service';
import { ModalService } from '../../services/modal.service';
import { LogmodalComponent } from '../../modals/logmodal/logmodal.component';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'app-logtable',
  templateUrl: './logtable.component.html',
  styleUrls: ['./logtable.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LogtableComponent implements OnInit, OnDestroy{
  logs: Logs[] = [];
  ArrayLogs: Logs[] = [];
  logId: number;
  Subscription: Subscription = new Subscription();

  constructor(private logsService: TableService, private modalService: ModalService,private logmodal: LogmodalComponent, private sharedService: SharedService, private snackbar: SnackbarComponent) {
    this.logId = 0;
  }

  ngOnInit() {
    this.fetchLogsList();
    this.Subscription = this.sharedService.searchTerm.subscribe((palavraChave) => {
      this.filterByName(palavraChave);
    });
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  fetchLogsList() {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      console.error("ID do usuário não encontrado.");
      return;
    }

    this.logsService.popularLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.ArrayLogs = logs;
      },
      error: (error) => {
        console.error("Erro ao obter lista de logs:", error);
      }
    });
  }

  filterByName(palavraChave: string) {
    if (palavraChave) {
      palavraChave = palavraChave.toUpperCase();
      this.logs = this.ArrayLogs.filter(a =>
        a.targetEmail.toUpperCase().indexOf(palavraChave) >= 0 ||
        a.action.toUpperCase().indexOf(palavraChave) >= 0
      );
    } else {
      this.fetchLogsList();
    }
  }


  isUpdateLog(log: Logs): boolean {
    return log.action === 'Usuário Atualizado';
  }

  openModal(log: Logs) {
    this.logId = log.id;
    this.modalService.getLogDetails(log.id).subscribe({
      next: (details: any) => {
        if (details.beforeData || details.afterData) {
          this.logmodal.openModal();
        } else {
          this.snackbar.snackbarMessage("Não há informações para exibir.");
        }
      },
      error: (error) => {
        console.error("Erro ao obter informações do log:", error);
      }
    });
  }
}
