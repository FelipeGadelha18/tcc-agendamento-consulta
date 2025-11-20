import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  sucesso = '';
  erro = '';

  paciente = {
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
    numeroCasa: '',
    senha: ''
  };

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  salvar() {
    if (
      !this.paciente.nomeCompleto ||
      !this.paciente.cpf ||
      !this.paciente.telefone ||
      !this.paciente.email ||
      !this.paciente.endereco ||
      !this.paciente.numeroCasa ||
      !this.paciente.senha
    ) {
      this.erro = 'Preencha todos os campos.';
      this.sucesso = '';
      return;
    }

    this.pacienteService.cadastrar(this.paciente).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro realizado com sucesso!'
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cadastrar: ' + (err.error?.message || 'Erro desconhecido')
        });
      }
    });
  }
}
