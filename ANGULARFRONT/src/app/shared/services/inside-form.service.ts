import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Internos } from '../interfaces/internos';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InsideformService {

  constructor(private http: HttpClient) { }

  cadastrarinterno(interno: Internos): Observable<any> {
    return this.http.post<Internos>(`${environment.API}InsideUser/insideregister`, interno)
  }

  edit(insideUserId: number, UserId: number): Observable<Internos>{
    return this.http.get<Internos>(`${environment.API}InsideUser/GetInsideUsersID`, {params: {insideUserId: insideUserId.toString(), UserId: UserId.toString()}});
  }

  saveEdit(id?: number, newData?: Internos): Observable<any> {
    return this.http.put(`${environment.API}InsideUser/insideregister/${id}`, newData);
  }
}
