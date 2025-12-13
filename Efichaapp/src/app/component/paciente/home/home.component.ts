import { Component } from '@angular/core';
import { CommonModule, NgForOf, NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [NgForOf, RouterLink, NgClass, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  cards = [
    { icon: 'pi pi-map-marker', title: 'Postos<br>Próximos', route: '/paciente/postos-proximos' },
    { icon: 'pi pi-calendar', title: 'Reservar Ficha', route: '/paciente/reservar-ficha' },
    { icon: 'pi pi-file', title: 'Minhas Fichas', route: '/paciente/minhas-fichas' },
    { icon: 'pi pi-user', title: 'Perfil', route: '/perfil' },
  ];

}
