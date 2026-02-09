import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  paciente: any = {};
  carregando = false;
  editando = false;
  photoPreview: string | null = null;

  constructor(
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.carregarPaciente();
  }

  carregarPaciente(): void {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && (user.id || user.codigo || user.codigoPaciente)) {
          const id = user.id || user.codigo || user.codigoPaciente;
          this.pacienteService.getById(id).subscribe({
            next: (resp) => {
              this.paciente = resp;
            },
            error: () => {
              this.paciente = user;
            }
          });
          return;
        }
        this.paciente = user;
      } catch (e) {
        this.paciente = {};
      }
    }
  }

  onFotoSelecionada(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
        this.paciente.foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  salvarPerfil(): void {
    if (!this.paciente.id) {
      alert('Erro: ID do paciente não encontrado');
      return;
    }

    this.carregando = true;
    this.pacienteService.atualizar(this.paciente.id, this.paciente).subscribe({
      next: (response) => {
        this.paciente = response;
        localStorage.setItem('usuario', JSON.stringify(response));
        this.editando = false;
        this.carregando = false;
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        this.carregando = false;
        console.error(err);
        alert('Erro ao atualizar perfil');
      }
    });
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.photoPreview = null;
    this.carregarPaciente();
  }

  voltarHome(): void {
    this.router.navigate(['/paciente/inicio']);
  }

  sair(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipoUsuario');
    this.router.navigate(['/login']);
  }

}
