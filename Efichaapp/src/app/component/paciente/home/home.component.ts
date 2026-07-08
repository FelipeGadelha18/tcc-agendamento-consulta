import { Component } from '@angular/core';
import { CommonModule, NgForOf, NgClass } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { AuthService, LoginResponse } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [NgForOf, RouterLink, NgClass, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  usuario: LoginResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.authService.obterUsuario();
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
