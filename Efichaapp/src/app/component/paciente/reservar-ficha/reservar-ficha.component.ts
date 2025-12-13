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

  // 📅 DATAS FIXAS (temporário até ADM)
  datasDisponiveis: string[] = [
    '2025-10-01',
    '2025-10-02',
    '2025-10-03'
  ];

  dataSelecionada: string = '';

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
    this.dataSelecionada = ''; // limpa data ao trocar de posto
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

    this.http.post('http://localhost:8080/reservas', reserva)
      .subscribe({
        next: () => {
          alert('Ficha reservada com sucesso!');
          this.router.navigate(['/paciente/inicio']);
        },
        error: (err) => {
          alert(err.error?.message || 'Erro ao reservar ficha');
        }
      });
  }
}
