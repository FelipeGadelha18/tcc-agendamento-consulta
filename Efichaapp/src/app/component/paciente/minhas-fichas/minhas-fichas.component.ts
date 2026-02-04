import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-minhas-fichas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minhas-fichas.component.html',
  styleUrls: ['./minhas-fichas.component.scss']
})
export class MinhasFichasComponent implements OnInit {

  reservas: any[] = [];
  pacienteLogado: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.pacienteLogado = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (this.pacienteLogado?.id) {
      this.carregarMinhasReservas();
    }
  }

  carregarMinhasReservas() {
    this.http
      .get<any[]>(`http://localhost:8080/reservas/por-paciente/${this.pacienteLogado.id}`)
      .subscribe({
        next: (dados) => {
          this.reservas = dados.map(r => ({
            ...r,
            status: r.status || 'CONFIRMADA'
          }));
        },
        error: () => alert('Erro ao carregar suas fichas')
      });
  }

  cancelarFicha(idReserva: number) {
    if (!confirm('Deseja realmente cancelar esta ficha?')) {
      return;
    }

    this.http
      .put(`http://localhost:8080/reservas/cancelar/${idReserva}`, {})
      .subscribe({
        next: () => {
          alert('Ficha cancelada com sucesso!');
          this.carregarMinhasReservas();
        },
        error: () => alert('Erro ao cancelar ficha')
      });
  }

  // 🔹 NOVA FUNÇÃO: baixar comprovante PDF
  baixarComprovante(idReserva: number) {
    this.http
      .get(`http://localhost:8080/reservas/${idReserva}/comprovante`, {
        responseType: 'blob'
      })
      .subscribe({
        next: (pdf) => {
          const blob = new Blob([pdf], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `comprovante-reserva-${idReserva}.pdf`;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: () => alert('Erro ao baixar comprovante')
      });
  }
}
