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
        next: (dados) => this.reservas = dados,
        error: () => alert('Erro ao carregar suas fichas')
      });
  }
}
