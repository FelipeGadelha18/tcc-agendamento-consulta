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
  styleUrl: './painel-controle.component.scss'
})

export class PainelControleComponent implements OnInit {
  administrador: Administrador | null = null;
  idPosto: number | null = null;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.administrador = this.authService.obterAdministrador();
    this.idPosto = this.authService.obterIdPosto();
  }

  fichas = [
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
    { nome: 'Maria Eduarda', cpf: '999.999.999-89', numero: 1, status: 'Aguardando' },
    { nome: 'João Silva', cpf: '888.888.888-77', numero: 2, status: 'Aguardando' },
    { nome: 'Ana Costa', cpf: '777.777.777-66', numero: 3, status: 'Aguardando' },
  ];

  onGlobalFilter(event: any, dt: any) {
    dt.filterGlobal(event.target.value, 'contains');
  }

  confirmarFicha(ficha: any) {
    ficha.status = 'Confirmada';

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

  atualizarFichas() {
    // Recarrega os dados da tabela
    console.log('Atualizando fichas...');
    // Aqui você pode chamar um serviço para buscar dados atualizados do backend
    // this.fichasService.obterFichas().subscribe(fichas => {
    //   this.fichas = fichas;
    // });
  }
}

