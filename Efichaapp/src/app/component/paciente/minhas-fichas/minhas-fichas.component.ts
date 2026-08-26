import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ReservaService } from '../../../services/reservar.service';


@Component({
  selector: 'app-minhas-fichas',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, RouterLink],
  templateUrl: './minhas-fichas.component.html',
  styleUrls: ['./minhas-fichas.component.scss']
})
export class MinhasFichasComponent implements OnInit {

  reservas: any[] = [];
  pacienteLogado: any = null;
  items: MenuItem[] = [];

  constructor(
    private http: HttpClient,
    private reservaService: ReservaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pacienteLogado = JSON.parse(localStorage.getItem('usuario') || '{}');

    this.configurarMenu();

    if (this.pacienteLogado?.id) {
      this.carregarMinhasReservas();
    }
  }

  configurarMenu() {
    this.items = [
      {
        label: 'Início',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/paciente/inicio'])
      },
      {
        label: 'Reservar ficha',
        icon: 'pi pi-calendar-plus',
        command: () => this.router.navigate(['/paciente/reservar-ficha'])
      },
      {
        label: 'Postos próximos',
        icon: 'pi pi-map-marker',
        command: () => this.router.navigate(['/paciente/postos-proximos'])
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/paciente/perfil'])
      }
    ];
  }

  getStatusLabel(status: string | null | undefined): string {
    return status || 'Sem status';
  }

  getStatusClass(status: string | null | undefined): string {
    switch (status) {
      case 'NO_SHOW':
        return 'cancelada';
      case 'UTILIZADA':
        return 'confirmada';
      case 'CHAMADO':
        return 'chamado';
      default:
        return (status || '').toLowerCase();
    }
  }

  carregarMinhasReservas() {
    this.reservaService.listarPorPaciente(this.pacienteLogado.id)
      .subscribe({
        next: (dados) => {
          this.reservas = dados.map(r => ({
            ...r,
            status: r.status || 'CONFIRMADA',
            posicaoNaFila: r.posicaoNaFila || null
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
      .put(`http://localhost:8080/reservas/${idReserva}/cancelar/${this.pacienteLogado.id}`, {})
      .subscribe({
        next: () => {
          alert('Ficha cancelada com sucesso!');
          this.carregarMinhasReservas();
        },
        error: () => alert('Erro ao cancelar ficha')
      });
  }

  baixarComprovante(idReserva: number) {
    this.reservaService.baixarComprovante(idReserva).subscribe({
      next: (pdf: Blob) => {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `comprovante-reserva-${idReserva}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Erro ao baixar comprovante')
    });
  }

  voltarInicio() {
    this.router.navigate(['/paciente/inicio']);
  }
}
