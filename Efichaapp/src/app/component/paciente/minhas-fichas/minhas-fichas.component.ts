import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';


@Component({
  selector: 'app-minhas-fichas',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './minhas-fichas.component.html',
  styleUrls: ['./minhas-fichas.component.scss']
})
export class MinhasFichasComponent implements OnInit {

  reservas: any[] = [];
  pacienteLogado: any = null;
  items: MenuItem[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

  voltarInicio() {
    this.router.navigate(['/paciente/inicio']);
  }
}
