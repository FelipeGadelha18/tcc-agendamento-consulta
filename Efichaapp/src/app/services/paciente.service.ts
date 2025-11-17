import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:8080/pacientes';

  constructor(private http: HttpClient) {}

  cadastrar(paciente: any): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }
}
