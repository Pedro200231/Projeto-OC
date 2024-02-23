import { Component, Injectable, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Internos } from '../../interfaces/internos';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class ModalComponent implements OnChanges {
  Internos?: Internos;
  @Input() InternoId: number

  constructor(private modalService: ModalService) {
    this.InternoId = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['InternoId'].currentValue !== 0){
      this.modalService.detalhes(changes['InternoId'].currentValue).subscribe({
        next: (internos) => {
          this.Internos=internos;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  openModal(){
    var x = document.getElementById("infoModal");
    if (x !== null) {
      x.style.display = "block";
    }
  }
  closeModal(){
    var x = document.getElementById("infoModal");
    if (x !== null) {
      x.style.display = "none";
    }
  }
}
