import { Component, Injectable, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Logs } from '../../interfaces/logs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-logmodal',
  templateUrl: './logmodal.component.html',
  styleUrls: ['./logmodal.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LogmodalComponent implements OnChanges {
  modifiedDetailsHTML: string = '';
  selectedLog: Logs | null = null;
  @Input() logId: number;

  constructor(private logmodal: ModalService) {
    this.logId = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['logId'].currentValue !== 0){
      this.logmodal.getLogDetails(changes['logId'].currentValue).subscribe({
        next: (details: any) => {
          this.selectedLog = details;
          this.formatModifiedDetails();
        },
        error: (error) => {
         
        }
      });
    }
  }

  openModal() {
    const modal = document.getElementById("logModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal() {
    const modal = document.getElementById("logModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  formatModifiedDetails() {
    if (!this.selectedLog) return;

    const beforeObj = this.removeUnnecessaryData(this.selectedLog.beforeData);
    const afterObj = this.removeUnnecessaryData(this.selectedLog.afterData);

    let modifiedDetailsHTML = '';
    for (const key in beforeObj) {
      const beforeValue = beforeObj[key];
      const afterValue = afterObj[key];

      if (beforeValue !== afterValue) {
        modifiedDetailsHTML += `<p><strong>${key}:</strong> ${beforeValue} => ${afterValue}</p>`;
      }
    }

    if (modifiedDetailsHTML.trim() === '') {
      modifiedDetailsHTML = "<p>Não há informações para exibir.</p>";
    }

    this.modifiedDetailsHTML = modifiedDetailsHTML;
  }

  removeUnnecessaryData(jsonString: string | undefined): any {
    try {
      if (!jsonString) return {};
      const obj = JSON.parse(jsonString);
      delete obj.Id;
      delete obj.DataCadastro;

      return obj;
    } catch (error) {
      console.error("Erro ao fazer o parse do JSON:", error);
      return {};
    }
  }
}
