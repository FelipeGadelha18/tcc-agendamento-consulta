import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService, LoginResponse } from '../../services/auth.service';

import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    ToastModule,
    PasswordModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  cpf: string = '';
  senha!: string;
  tipoLogin: string = 'PACIENTE';
  carregando: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  formatarCpf() {
    let cpf = this.cpf.replace(/\D/g, '');
    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11);
    }
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    this.cpf = cpf;
  }

  entrar() {
    if (!this.cpf || !this.senha) {
      this.messageService.add({
        severity:'warn',
        summary: 'Atenção',
        detail: 'CPF e Senha são obrigatórios.'
      });
      return;
    }

    const cpfLimpo = this.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      this.messageService.add({
        severity:'warn',
        summary: 'Atenção',
        detail: 'CPF deve ter 11 dígitos.'
      });
      return;
    }

    if (this.tipoLogin === 'PACIENTE') {
      this.loginPaciente(cpfLimpo);
    } else {
      this.loginAdministrador(cpfLimpo);
    }
  }

  loginPaciente(cpfLimpo: string) {
    this.carregando = true;
    this.authService.loginPaciente(cpfLimpo, this.senha).subscribe({
      next: (response: LoginResponse) => {
        this.authService.salvarLoginPaciente(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo ${response.nome}!`
        });
        setTimeout(() => this.router.navigate(['/paciente/inicio']), 500);
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.carregando = false;
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail: err?.error?.message || 'CPF ou senha incorretos.'
        });
      }
    });
  }

  loginAdministrador(cpfLimpo: string) {
    this.carregando = true;
    this.authService.loginAdministrador(cpfLimpo, this.senha).subscribe({
      next: (response: LoginResponse) => {
        this.authService.salvarAdministrador(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo ${response.nome}!`
        });
        setTimeout(() => this.router.navigate(['/admin/painel-controle']), 500);
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.carregando = false;
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail: err?.error?.message || 'CPF ou senha incorretos.'
        });
      }
    });
  }
}

