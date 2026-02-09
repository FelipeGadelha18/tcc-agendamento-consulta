import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Administrador } from '../../../models/administrador.model';
import { ReservaService } from '../../../services/reservar.service';

@Component({
  selector: 'app-painel-controle',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './painel-controle.component.html',
  styleUrls: ['./painel-controle.component.scss']
})

export class PainelControleComponent implements OnInit {
  administrador: Administrador | null = null;
  idPosto: number | null = null;

  fichas: any[] = [];
  totalRecords: number = 0;
  pageSize: number = 5;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.administrador = this.authService.obterAdministrador();
    this.idPosto = this.authService.obterIdPosto();
    this.atualizarFichas(0, this.pageSize);
  }

  onGlobalFilter(event: any, dt: any) {
    dt.filterGlobal(event.target.value, 'contains');
  }

  confirmarFicha(ficha: any) {
    if (!ficha.id) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ficha inválida' });
      return;
    }

    this.reservaService.confirmarReserva(ficha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ficha confirmada',
          detail: `A ficha de ${ficha.nome} foi confirmada com sucesso`
        });
        this.atualizarFichas(0, this.pageSize);
      },
      error: (err: any) => {
        console.error('Erro ao confirmar reserva', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao confirmar ficha' });
      }
    });
  }

  cancelarFicha(ficha: any) {
    if (!ficha.id || !ficha.pacienteId) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ficha inválida' });
      return;
    }

    this.reservaService.cancelarReserva(ficha.id, ficha.pacienteId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Ficha cancelada',
          detail: `A ficha de ${ficha.nome} foi cancelada`
        });
        this.atualizarFichas(0, this.pageSize);
      },
      error: (err: any) => {
        console.error('Erro ao cancelar reserva', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cancelar ficha' });
      }
    });
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  atualizarFichas(page: number = 0, size: number = this.pageSize) {
    console.log('Atualizando fichas... page=', page, 'size=', size);
    if (!this.idPosto) {
      this.fichas = [];
      this.totalRecords = 0;
      return;
    }

    this.reservaService.listarPorPostoPaginado(this.idPosto, page, size).subscribe({
      next: (res: any) => {
        const content = res?.content ?? res;
        this.totalRecords = res?.totalElements ?? content.length;
        this.fichas = content.map((r: any, i: number) => ({
          id: r.id,
          pacienteId: r.paciente?.id,
          nome: r.paciente?.nomeCompleto || r.paciente?.nome || '—',
          cpf: r.paciente?.cpf || '—',
          numero: r.numero ?? r.id ?? (page * size) + i + 1,
          status: r.status,
          dataReserva: r.dataReserva ?? null,
          posto: r.postoSaude?.nome || '—'
        }));
      },
      error: (err: any) => {
        console.error('Erro ao carregar reservas', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar reservas' });
      }
    });
  }

  onLazyLoad(event: any) {
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageSize = size;
    this.atualizarFichas(page, size);
  }
}


