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

  // 🔹 Listar reservas por posto
  listarPorPosto(postoId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/por-posto/${postoId}`);
  }

  // 🔹 Listar reservas por posto (paginado)
  listarPorPostoPaginado(postoId: number, page: number = 0, size: number = 10) {
    return this.http.get<any>(`${this.apiUrl}/por-posto/${postoId}/paged?page=${page}&size=${size}`);
  }

  // 🔹 Confirmar reserva (ADMIN)
  confirmarReserva(reservaId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/confirmar`, {});
  }

  // 🔹 Cancelar reserva
  cancelarReserva(reservaId: number, pacienteId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/cancelar/${pacienteId}`, {});
  }
}
