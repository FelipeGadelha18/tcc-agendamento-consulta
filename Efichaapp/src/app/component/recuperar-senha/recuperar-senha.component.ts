import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-recuperar-senha',
    standalone: true,
    imports: [CommonModule, FormsModule, ToastModule, RouterLink],
    providers: [MessageService],
    templateUrl: './recuperar-senha.component.html',
    styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent {

    cpf: string = '';
    novaSenha: string = '';
    confirmarSenha: string = '';
    mostrarSenha1: boolean = false;
    mostrarSenha2: boolean = false;
    carregando: boolean = false;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    alternarVisibilidadeSenha1() {
        this.mostrarSenha1 = !this.mostrarSenha1;
    }

    alternarVisibilidadeSenha2() {
        this.mostrarSenha2 = !this.mostrarSenha2;
    }

    avaliarForcaSenha(): { forca: string; nivel: number; cor: string } {
        if (!this.novaSenha) {
            return { forca: '', nivel: 0, cor: '#ddd' };
        }

        let nivel = 0;
        const senha = this.novaSenha;

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

    recuperar() {
        // Validações
        if (!this.cpf || !this.novaSenha || !this.confirmarSenha) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Todos os campos são obrigatórios.'
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

        if (this.novaSenha.length < 6) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Senha deve ter no mínimo 6 caracteres.'
            });
            return;
        }

        if (this.novaSenha !== this.confirmarSenha) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'As senhas não correspondem.'
            });
            return;
        }

        // Chamar o serviço
        this.carregando = true;
        this.authService.recuperarSenha(cpfLimpo, this.novaSenha).subscribe({
            next: () => {
                this.carregando = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Senha alterada com sucesso! Redirecionando para login...'
                });
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
                console.error(err);
                this.carregando = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err?.error?.message || 'Erro ao recuperar senha. Verifique o CPF e tente novamente.'
                });
            }
        });
    }
}
