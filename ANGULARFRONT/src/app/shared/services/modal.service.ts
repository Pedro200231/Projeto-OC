import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Internos } from '../interfaces/internos';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private http: HttpClient){ }

  detalhes(id: number): Observable<Internos>{
    return this.http.get<Internos>(`${environment.API}InsideUser/GetInsideUsers/${id}`);
  }
  
  delete(id: number): Observable<Internos>{
    return this.http.delete<Internos>(`${environment.API}InsideUser/insideregister/${id}`);
  }

  getLogDetails(logId: number){
    return this.http.get(`${environment.API}InsideUser/UserLog/details/${logId}`)
  }

}
