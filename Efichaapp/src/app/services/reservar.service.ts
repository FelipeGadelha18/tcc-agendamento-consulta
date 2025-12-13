import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient) {}

  reservarFicha(pacienteId: number, postoId: number) {
    return this.http.post(this.apiUrl, {
      paciente: { id: pacienteId },
      postoSaude: { id: postoId }
    });
  }
}
