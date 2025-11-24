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
    { icon: 'pi pi-map-marker', title: 'Postos<br>Próximos', route: '/postos-proximos' },
    { icon: 'pi pi-calendar', title: 'Reservar Ficha', route: '/reservar' },
    { icon: 'pi pi-file', title: 'Minhas Fichas', route: '/fichas' },
    { icon: 'pi pi-user', title: 'Perfil', route: '/perfil' },
  ];

}
