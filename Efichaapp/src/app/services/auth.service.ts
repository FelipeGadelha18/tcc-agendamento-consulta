import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  id: number;
  token: string;
  tipo: string;
  nome: string;
  cpf: string;
  idPosto?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  loginPaciente(cpf: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/pacientes/login`, {
      cpf: cpf,
      senha: senha
    });
  }

  loginAdministrador(cpf: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/administradores/login`, {
      cpf: cpf,
      senha: senha
    });
  }

  salvarLoginPaciente(response: LoginResponse): void {
    localStorage.setItem('usuario', JSON.stringify({
      id: response.id,
      nome: response.nome,
      cpf: response.cpf,
      tipo: response.tipo
    }));
    localStorage.setItem('tipoUsuario', 'PACIENTE');
    localStorage.setItem('token', response.token);
  }

  salvarAdministrador(response: LoginResponse): void {
    localStorage.setItem('usuario', JSON.stringify({
      id: response.id,
      nome: response.nome,
      cpf: response.cpf,
      tipo: response.tipo,
      idPosto: response.idPosto
    }));
    localStorage.setItem('tipoUsuario', 'ADM');
    localStorage.setItem('token', response.token);
    localStorage.setItem('idPosto', String(response.idPosto || 0));
  }

  obterAdministrador(): any {
    const admin = localStorage.getItem('usuario');
    return admin ? JSON.parse(admin) : null;
  }

  obterIdPosto(): number | null {
    const idPosto = localStorage.getItem('idPosto');
    return idPosto ? parseInt(idPosto) : null;
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  isAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idPosto');
    localStorage.removeItem('token');
  }
}

