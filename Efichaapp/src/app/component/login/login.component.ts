import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


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

  constructor(
    private router: Router,
    private messageService: MessageService,
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

    // next:(Response)

    console.log('CPF:', this.cpf);
    console.log('Senha:', this.senha);

    localStorage.setItem('tipoUsuario', 'PACIENTE');
    this.router.navigate(['/paciente/inicio']);
  }
}
