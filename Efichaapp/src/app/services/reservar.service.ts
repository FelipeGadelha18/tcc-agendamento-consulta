import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient) {}

  // 🔹 Criar reserva
  reservarFicha(pacienteId: number, postoId: number) {
    return this.http.post(this.apiUrl, {
      paciente: { id: pacienteId },
      postoSaude: { id: postoId }
    });
  }

  // 🔹 Baixar comprovante em PDF
  baixarComprovante(reservaId: number) {
    return this.http.get(
      `${this.apiUrl}/${reservaId}/comprovante`,
      { responseType: 'blob' }
    );
  }
}
