import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgClass } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { AuthService, LoginResponse } from '../../../services/auth.service';
import { ReservaService } from '../../../services/reservar.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [NgForOf, RouterLink, NgClass, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  usuario: LoginResponse | null = null;
  proximaReserva: any = null;

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.authService.obterUsuario();

    if (this.usuario?.id) {
      this.carregarProximaReserva();
    }
  }

  carregarProximaReserva(): void {
    this.reservaService.listarPorPaciente(this.usuario!.id).subscribe({
      next: (reservas) => {
        this.proximaReserva = this.obterProximaReserva(reservas);
      },
      error: () => {
        this.proximaReserva = null;
      }
    });
  }

  private obterProximaReserva(reservas: any[]): any {
    const reservasValidas = (reservas || [])
      .filter((reserva) => reserva?.dataReserva && !['CANCELADA', 'NO_SHOW', 'UTILIZADA'].includes(reserva?.status?.toUpperCase?.() ?? ''))
      .sort((a, b) => (a.dataReserva > b.dataReserva ? 1 : -1));

    return reservasValidas[0] ?? null;
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cards = [
    { icon: 'pi pi-map-marker', title: 'Postos<br>Próximos', route: '/paciente/postos-proximos' },
    { icon: 'pi pi-calendar', title: 'Reservar Ficha', route: '/paciente/reservar-ficha' },
    { icon: 'pi pi-file', title: 'Minhas Fichas', route: '/paciente/minhas-fichas' },
    { icon: 'pi pi-user', title: 'Perfil', route: '/paciente/perfil' },
  ];

}
