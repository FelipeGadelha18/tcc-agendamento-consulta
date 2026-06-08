import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient) { }

  reservarFicha(pacienteId: number, postoId: number, dataReserva: string) {
    return this.http.post(this.apiUrl + '/nova', {
      pacienteId,
      postoId,
      dataReserva
    });
  }

  emitirFichaManual(nomeCompleto: string, cpf: string, postoId: number, dataReserva: string) {
    return this.http.post(this.apiUrl + '/manual', {
      nomeCompleto,
      cpf,
      postoId,
      dataReserva
    });
  }

  baixarComprovante(reservaId: number) {
    return this.http.get(
      `${this.apiUrl}/${reservaId}/comprovante`,
      { responseType: 'blob' }
    );
  }

  listarPorPosto(postoId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/por-posto/${postoId}`);
  }

  listarPorPostoPaginado(postoId: number, page: number = 0, size: number = 10) {
    return this.http.get<any>(`${this.apiUrl}/por-posto/${postoId}/paged?page=${page}&size=${size}`);
  }

  listarPorPaciente(pacienteId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/por-paciente/${pacienteId}`);
  }

  cancelarReserva(reservaId: number, pacienteId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/cancelar/${pacienteId}`, {});
  }

  cancelarReservaAdministrador(reservaId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/cancelar`, {});
  }

  confirmarReservaAdministrador(reservaId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/confirmar`, {});
  }

  chamarProximo(postoId: number) {
    return this.http.put(`${this.apiUrl}/posto/${postoId}/chamar-proximo`, {});
  }

  registrarCheckin(reservaId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/checkin`, {});
  }

  finalizarAtendimento(reservaId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/finalizar`, {});
  }

  marcarNoShow(reservaId: number) {
    return this.http.put(`${this.apiUrl}/${reservaId}/no-show`, {});
  }
}
