import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { Internos } from '../../interfaces/internos';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-deletemodal',
  templateUrl: './deletemodal.component.html',
  styleUrl: './deletemodal.component.css'
})

@Injectable({
  providedIn: 'root'
})


export class DeletemodalComponent {
  Internos?: Internos;
  @Input() InternoId: number
  @Output() deletionConfirmed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private deleteService: ModalService, private snackbar: SnackbarComponent) {
    this.InternoId = 0;
  }

    openDeleteModal(){
      var x = document.getElementById("confirmDeleteModal");
      if (x !== null) {
        x.style.display = "block";
      }
    }

    closeModal(){
      var x = document.getElementById("confirmDeleteModal");
      if (x !== null) {
        x.style.display = "none";
      }
    }

    confirmDelete() {
      this.deleteService.delete(this.InternoId).subscribe({
        next: () => {
          this.snackbar.snackbarMessage("Deletado com sucesso!");
          this.deletionConfirmed.emit();
          this.closeModal();
        },
        error: (error) => {
          this.snackbar.snackbarMessage("Erro ao deletar", error);
        }
      });
    }
}
