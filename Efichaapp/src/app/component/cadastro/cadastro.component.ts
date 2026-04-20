import { Component, OnInit } from '@angular/core';
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

  senha!: string;
  mostrarSenha: boolean = false;

  alternarVisibilidadeSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  avaliarForcaSenha(): { forca: string; nivel: number; cor: string } {
    if (!this.senha) {
      return { forca: '', nivel: 0, cor: '#ddd' };
    }

    let nivel = 0;
    const senha = this.senha;

    // Verifica comprimento
    if (senha.length >= 8) nivel++;
    if (senha.length >= 12) nivel++;

    // Verifica tipos de caracteres
    if (/[a-z]/.test(senha)) nivel++;
    if (/[A-Z]/.test(senha)) nivel++;
    if (/[0-9]/.test(senha)) nivel++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) nivel++;

    // Mapeia para níveis: 1-2 = Fraca, 3-4 = Média, 5+ = Forte
    if (nivel <= 2) {
      return { forca: 'Fraca', nivel: 1, cor: '#ef4444' };
    } else if (nivel <= 4) {
      return { forca: 'Média', nivel: 2, cor: '#f59e0b' };
    } else {
      return { forca: 'Forte', nivel: 3, cor: '#10b981' };
    }
  }

  ngOnInit(): void {
    const s: any = history.state?.paciente;
    if (s) {
      this.paciente = { ...this.paciente, ...s };
    }
  }

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
  ) { }

  formatarCpf() {
    let cpf = this.paciente.cpf.replace(/\D/g, '');
    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11);
    }
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    this.paciente.cpf = cpf;
  }

  salvar() {
    this.paciente.senha = this.senha;

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

    const cpfLimpo = this.paciente.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'CPF deve ter 11 dígitos.'
      });
      return;
    }

    const pacienteParaEnviar = { ...this.paciente, cpf: cpfLimpo };

    this.pacienteService.cadastrar(pacienteParaEnviar).subscribe({
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
