import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { TableService } from '../services/table.service';
import { Internos } from '../interfaces/internos';
import { ModalService } from '../services/modal.service';
import { ModalComponent } from '../modals/infomodal/modal.component';
import { DeletemodalComponent } from '../modals/deletemodal/deletemodal.component';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
@Injectable(
  {
    providedIn: 'root'
  }

)
export class TableComponent implements OnInit, OnDestroy{
  @Input() palavra: string = '';
  ArrayFilter: Internos[] = [];
  Internos: Internos[] = [];
  InternoId: number;
  DeleteId: number;
  EditId: number;
  Subscription: Subscription = new Subscription();

  constructor(private service: TableService, private ModalService: ModalService, private modal: ModalComponent, private deleteModal: DeletemodalComponent, private sharedService: SharedService, private router: Router) {
    this.InternoId = 0;
    this.DeleteId = 0;
    this.EditId = 0;

  }

  ngOnInit() {
    this.loadInternos();
    this.Subscription = this.sharedService.searchTerm.subscribe((palavraChave) => {
      this.filterByName(palavraChave);
    });
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  loadInternos() {
    this.Internos = [];
    this.service.list().subscribe({
      next: (internos) => {
        internos.reverse();
        this.Internos = internos;
        this.ArrayFilter = internos;
        if (window.location.pathname === '/home') {
          this.Internos = this.Internos.slice(0, 4);

        }
      },
      error: (error) => {
      }
    });
  }

  openModal(id: number) {
    this.InternoId = id;
    this.ModalService.detalhes(id).subscribe({
      next: (Interno) => {
        Interno = Interno;
        this.modal.openModal();
      },
      error: (error) => {

      }
    });
  }

  openEditPage(id: number) {
    this.router.navigate(['/register/edit', id]);

  }

  openConfirmDeleteModal(id: number) {
    this.DeleteId = id;
    this.deleteModal.openDeleteModal();
  }

  onDeletionConfirmed() {
    this.refreshTable();
  }

  refreshTable() {
    this.loadInternos();
  }

  filterByName(palavraChave: string) {
    if (palavraChave) {
      palavraChave = palavraChave.toUpperCase();
      this.Internos = this.ArrayFilter.filter(a =>
            a.name.toUpperCase().indexOf(palavraChave) >= 0
        );
    } else{
      this.loadInternos();
    }
  }

}
