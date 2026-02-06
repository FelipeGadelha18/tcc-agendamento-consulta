import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  cpf: string = '';
  senha: string = '';
  tipoLogin: string = 'PACIENTE'; // PACIENTE ou ADM

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  entrar() {
    if (!this.cpf || !this.senha) {
      this.messageService.add({
        severity:'warn',
        summary: 'Atenção',
        detail: 'CPF e Senha são obrigatórios.'
      });
      return;
    }

    if (this.tipoLogin === 'PACIENTE') {
      this.loginPaciente();
    } else {
      this.loginAdministrador();
    }
  }

  loginPaciente() {
    this.authService.loginPaciente(this.cpf, this.senha).subscribe({
      next: (response) => {
        console.log('Login PACIENTE OK:', response);

        // Salva dados no localStorage
        localStorage.setItem('usuario', JSON.stringify(response));
        localStorage.setItem('tipoUsuario', 'PACIENTE');

        this.router.navigate(['/paciente/inicio']);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail: 'CPF ou senha incorretos.'
        });
      }
    });
  }

  loginAdministrador() {
    this.authService.loginAdministrador(this.cpf, this.senha).subscribe({
      next: (response) => {
        console.log('Login ADM OK:', response);

        // Salva dados no localStorage usando AuthService
        this.authService.salvarAdministrador(response);

        this.router.navigate(['/admin/painel-controle']);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail: 'CPF ou senha incorretos.'
        });
      }
    });
  }
}

