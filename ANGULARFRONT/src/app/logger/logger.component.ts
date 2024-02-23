// logs.component.ts
import { Component } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';


@Component({
  selector: 'app-logs',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent{
  palavraChave: string = '';

  constructor(private sharedService: SharedService) { }


  filterByName() {
    this.sharedService.searchTerm.next(this.palavraChave);
  }

}
