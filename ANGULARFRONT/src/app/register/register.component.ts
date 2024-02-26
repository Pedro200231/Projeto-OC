import { Component } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  palavraChave: string = '';

  constructor(private sharedService: SharedService) {}

  filterByName() {
    this.sharedService.searchTerm.emit(this.palavraChave);
  }
}
