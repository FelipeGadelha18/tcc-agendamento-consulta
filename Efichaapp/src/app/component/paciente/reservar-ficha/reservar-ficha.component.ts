import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservar-ficha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservar-ficha.component.html',
  styleUrls: ['./reservar-ficha.component.scss']
})
export class ReservarFichaComponent implements OnInit {

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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pacienteLogado = JSON.parse(localStorage.getItem('usuario') || '{}');

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
    if (!this.postoSelecionado || !this.dataSelecionada) {
      alert('Selecione posto e data');
      return;
    }

    const reserva = {
      dataReserva: this.dataSelecionada,
      paciente: { id: this.pacienteLogado.id },
      postoSaude: { id: this.postoSelecionado.id }
    };

    this.http.post<any>('http://localhost:8080/reservas', reserva)
      .subscribe(() => {
        this.reservaConfirmada = true;
        this.dadosConfirmacao = {
          data: this.dataSelecionada,
          horario: '08:00',
          posto: this.postoSelecionado.nome
        };
      });
  }

  verMinhasFichas() {
    this.router.navigate(['/paciente/minhas-fichas']);
  }

  voltarInicio() {
    this.router.navigate(['/paciente/inicio']);
  }
}
