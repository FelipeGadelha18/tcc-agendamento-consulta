import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../models/administrador.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  loginPaciente(cpf: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes/login`, {
      cpf: cpf,
      senha: senha
    });
  }

  loginAdministrador(cpf: string, senha: string): Observable<Administrador> {
    return this.http.post<Administrador>(`${this.apiUrl}/administradores/login`, {
      cpf: cpf,
      senha: senha
    });
  }

  salvarAdministrador(admin: Administrador): void {
    localStorage.setItem('usuario', JSON.stringify(admin));
    localStorage.setItem('tipoUsuario', 'ADM');
    localStorage.setItem('idPosto', admin.idPosto.toString());
  }

  obterAdministrador(): Administrador | null {
    const admin = localStorage.getItem('usuario');
    return admin ? JSON.parse(admin) : null;
  }

  obterIdPosto(): number | null {
    const idPosto = localStorage.getItem('idPosto');
    return idPosto ? parseInt(idPosto) : null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idPosto');
  }
}

