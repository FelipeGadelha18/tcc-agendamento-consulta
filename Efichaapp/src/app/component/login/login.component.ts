import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ToastModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  cpf: string = '';
  senha!: string;
  mostrarSenha: boolean = false;
  tipoLogin: string | null = null;
  carregando: boolean = false;
  tiposLogin = [
    { label: 'Paciente', value: 'PACIENTE' },
    { label: 'Administrador', value: 'ADM' },
    { label: 'Recepcionista', value: 'RECEPCIONISTA' }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  alternarVisibilidadeSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  formatarCpf(): void {
    let cpf = this.cpf.replace(/\D/g, '');

    cpf = cpf.substring(0, 11);

    if (cpf.length > 9) {
      cpf = cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
        '$1.$2.$3-$4'
      );
    } else if (cpf.length > 6) {
      cpf = cpf.replace(
        /(\d{3})(\d{3})(\d{1,3})/,
        '$1.$2.$3'
      );
    } else if (cpf.length > 3) {
      cpf = cpf.replace(
        /(\d{3})(\d{1,3})/,
        '$1.$2'
      );
    }

    this.cpf = cpf;
  }

  entrar() {
    if (!this.cpf || !this.senha) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'CPF e Senha são obrigatórios.'
      });
      return;
    }

    const cpfLimpo = this.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'CPF deve ter 11 dígitos.'
      });
      return;
    }

    if (this.tipoLogin === 'PACIENTE') {
      this.loginPaciente(cpfLimpo);
    } else if (this.tipoLogin === 'RECEPCIONISTA') {
      this.loginRecepcionista(cpfLimpo);
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
          severity: 'error',
          summary: 'Erro',
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
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'CPF ou senha incorretos.'
        });
      }
    });
  }

  loginRecepcionista(cpfLimpo: string) {
    this.carregando = true;
    this.authService.loginRecepcionista(cpfLimpo, this.senha).subscribe({
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
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'CPF ou senha incorretos.'
        });
      }
    });
  }
}

