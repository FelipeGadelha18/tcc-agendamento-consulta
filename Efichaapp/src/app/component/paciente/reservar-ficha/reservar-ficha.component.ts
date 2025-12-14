import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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

  termoBusca: string = '';
  pacienteLogado: any = null;

  // 📅 DATAS FIXAS (temporário)
  datasDisponiveis: string[] = [
    '2025-10-01',
    '2025-10-02',
    '2025-10-03'
  ];

  dataSelecionada: string = '';

  // ✅ CONFIRMAÇÃO
  reservaConfirmada = false;
  dadosConfirmacao: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarPostos();
    this.pacienteLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  carregarPostos() {
    this.http.get<any[]>('http://localhost:8080/postos/listar')
      .subscribe(dados => {
        this.postos = dados;
        this.postosFiltrados = dados;
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

    if (!this.postoSelecionado) {
      alert('Selecione um posto');
      return;
    }

    if (!this.dataSelecionada) {
      alert('Selecione uma data');
      return;
    }

    if (!this.pacienteLogado || !this.pacienteLogado.id) {
      alert('Paciente não identificado. Faça login novamente.');
      return;
    }

    const reserva = {
      dataReserva: this.dataSelecionada,
      paciente: {
        id: this.pacienteLogado.id
      },
      postoSaude: {
        id: this.postoSelecionado.id
      }
    };

    this.http.post<any>('http://localhost:8080/reservas', reserva)
      .subscribe({
        next: (response) => {

          // ✅ MOSTRA TELA DE CONFIRMAÇÃO
          this.reservaConfirmada = true;

          this.dadosConfirmacao = {
            data: this.dataSelecionada,
            horario: '08:00', // fixo por enquanto
            posto: this.postoSelecionado.nome
          };
        },
        error: (err) => {
          alert(err.error?.message || 'Erro ao reservar ficha');
        }
      });
  }

  // 🔁 AÇÕES DA TELA FINAL
  verMinhasFichas() {
    this.router.navigate(['/paciente/minhas-fichas']);
  }

  voltarInicio() {
    this.router.navigate(['/paciente/inicio']);
  }
}
