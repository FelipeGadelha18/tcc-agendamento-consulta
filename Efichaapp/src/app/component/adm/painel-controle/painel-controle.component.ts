import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { PostoSaudeService } from '../../../services/posto-saude.service';

@Component({
  selector: 'app-painel-controle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  // datas que podem ser adicionadas pelo administrador
  datasDisponiveis: string[] = [];
  novaData: string = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private reservaService: ReservaService,
    private postoService: PostoSaudeService
  ) {}

  ngOnInit(): void {
    this.administrador = this.authService.obterAdministrador();
    this.idPosto = this.authService.obterIdPosto();
    this.atualizarFichas(0, this.pageSize);

    // carregar datas disponíveis atuais
    if (this.idPosto) {
      this.postoService.listarDatas(this.idPosto).subscribe(d => this.datasDisponiveis = d);
    }
  }

  onGlobalFilter(event: any, dt: any) {
    dt.filterGlobal(event.target.value, 'contains');
  }

  confirmarFicha(ficha: any) {
    ficha.status = 'CONFIRMADA';

    this.messageService.add({
      severity: 'success',
      summary: 'Ficha confirmada',
      detail: `A ficha de ${ficha.nome} foi confirmada com sucesso`
    });
  }

  cancelarFicha(ficha: any) {
    const index = this.fichas.indexOf(ficha);
    if (index > -1) {
      this.fichas.splice(index, 1);
    }

    this.messageService.add({
      severity: 'warn',
      summary: 'Ficha cancelada',
      detail: `A ficha de ${ficha.nome} foi cancelada`
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
          nome: r.paciente?.nomeCompleto || r.paciente?.nome || '—',
          cpf: r.paciente?.cpf || '—',
          numero: r.numero ?? r.id ?? (page * size) + i + 1,
          status: r.status
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

  adicionarData() {
    if (!this.novaData || !this.idPosto) {
      return;
    }
    this.postoService.adicionarData(this.idPosto, this.novaData).subscribe({
      next: () => {
        this.datasDisponiveis.push(this.novaData);
        this.novaData = '';
        this.messageService.add({ severity: 'success', summary: 'Data adicionada', detail: 'A data foi disponibilizada aos pacientes.' });
      },
      error: err => {
        console.error('erro adicionando data', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar a data.' });
      }
    });
  }

  excluirData(data: string) {
    if (!this.idPosto) return;
    this.postoService.removerData(this.idPosto, data).subscribe({
      next: () => {
        this.datasDisponiveis = this.datasDisponiveis.filter(d => d !== data);
        this.messageService.add({ severity: 'success', summary: 'Data removida', detail: 'A data foi excluída.' });
      },
      error: err => {
        console.error('erro removendo data', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover a data.' });
      }
    });
  }
}


