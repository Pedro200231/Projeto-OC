import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Internos } from '../interfaces/internos';
import { environment } from '../../../environments/environment.development';
import { Logs } from '../interfaces/logs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http: HttpClient) {}

  list(){
    let userId = sessionStorage.getItem('userId');
    return this.http.get<Internos[]>(`${environment.API}InsideUser/GetInsideUsersById/${userId}`);
  }

  popularLogs(){
    let userId = sessionStorage.getItem('userId');
    return this.http.get<Logs[]>(`${environment.API}InsideUser/userlog/${userId}`)
  }
}
