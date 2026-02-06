import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  paciente: any = {};

  constructor(
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && (user.id || user.codigo || user.codigoPaciente)) {
          const id = user.id || user.codigo || user.codigoPaciente;
          this.pacienteService.getById(id).subscribe({
            next: (resp) => this.paciente = resp,
            error: () => this.paciente = user
          });
          return;
        }
        this.paciente = user;
      } catch (e) {
        this.paciente = {};
      }
    }
  }

  sair(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
    this.router.navigate(['/login']);
  }

  editar(): void {
    this.router.navigate(['/cadastro'], { state: { paciente: this.paciente } });
  }

}
