import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reservar-ficha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './reservar-ficha.component.html',
  styleUrls: ['./reservar-ficha.component.scss'],
  providers: [MessageService]
})
export class ReservarFichaComponent implements OnInit {

  items: MenuItem[] = []; // ✅ FALTAVA ISSO

  postos: any[] = [];
  postosFiltrados: any[] = [];
  postoSelecionado: any = null;

  termoBusca = '';
  pacienteLogado: any = null;

  datasDisponiveis: string[] = [
    '2025-10-01',
    '2025-10-02',
    '2025-10-03'
  ];

  dataSelecionada = '';

  reservaConfirmada = false;
  dadosConfirmacao: any = null;

  postoIdRecebido: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.pacienteLogado = JSON.parse(localStorage.getItem('usuario') || '{}');

    this.configurarMenu();

    this.route.queryParams.subscribe(params => {
      if (params['postoId']) {
        this.postoIdRecebido = Number(params['postoId']);
      }
    });

    this.carregarPostos();
  }

  carregarPostos() {
    this.http.get<any[]>('http://localhost:8080/postos/listar')
      .subscribe(dados => {
        this.postos = dados;
        this.postosFiltrados = dados;

        if (this.postoIdRecebido) {
          this.postoSelecionado =
            this.postos.find(p => p.id === this.postoIdRecebido);
        }
      });
  }

  filtrarPostos() {
    const termo = this.termoBusca.toLowerCase();

    this.postosFiltrados = this.postos.filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      p.bairro.toLowerCase().includes(termo)
    );
  }

  selecionarPosto(posto: any) {
    this.postoSelecionado = posto;
    this.dataSelecionada = '';
  }

  reservarFicha() {

    if (!this.dataSelecionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Data obrigatória',
        detail: 'Selecione uma data para reservar a ficha'
      });
      return;
    }

    const reserva = {
      dataReserva: this.dataSelecionada,
      paciente: { id: this.pacienteLogado.id },
      postoSaude: { id: this.postoSelecionado.id }
    };

    this.http.post<any>('http://localhost:8080/reservas', reserva)
      .subscribe({
        next: () => {
          this.reservaConfirmada = true;
          this.dadosConfirmacao = {
            data: this.dataSelecionada,
            horario: '08:00',
            posto: this.postoSelecionado.nome
          };
        },
        error: (err) => {
          if (err.status === 409 || err.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Data indisponível',
              detail: 'Você já possui uma ficha reservada para esta data'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível reservar a ficha'
            });
          }
        }
      });
  }

  verMinhasFichas() {
    this.router.navigate(['/paciente/minhas-fichas']);
  }

  voltarInicio() {
    this.router.navigate(['/paciente/inicio']);
  }

  configurarMenu() {
    this.items = [
      {
        label: 'Início',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/paciente/inicio'])
      },
      {
        label: 'Minhas Fichas',
        icon: 'pi pi-receipt',
        command: () => this.router.navigate(['/paciente/minhas-fichas'])
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
}
