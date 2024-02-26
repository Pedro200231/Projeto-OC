import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  searchTerm: EventEmitter<string> = new EventEmitter();
  emitDetails: EventEmitter<any> = new EventEmitter();
  constructor() { }
}
