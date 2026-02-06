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

  login(cpf: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      cpf: cpf,
      senha: senha
    });
  }

  getById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
