// src/app/component/cadastro/cadastro.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { RouterLink, RouterModule } from '@angular/router'; // só se usar routerLink dentro do template

@Component({
  selector: 'app-cadastro',
  standalone: true,                      // <-- importante: componente standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  cadastroForm: FormGroup;
  sucesso = '';
  erro = '';

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  salvar() {
    if (this.cadastroForm.invalid) {
      this.erro = 'Preencha todos os campos corretamente.';
      this.sucesso = '';
      return;
    }

    const paciente = {
      nomeCompleto: this.cadastroForm.value.nome,
      cpf: this.cadastroForm.value.cpf,
      telefone: this.cadastroForm.value.telefone,
      email: this.cadastroForm.value.email,
      endereco: this.cadastroForm.value.endereco,
      numeroCasa: this.cadastroForm.value.numero,
      senha: this.cadastroForm.value.senha
    };

    this.pacienteService.cadastrar(paciente).subscribe({
      next: () => {
        this.sucesso = 'Cadastro realizado com sucesso!';
        this.erro = '';
        this.cadastroForm.reset();
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao salvar. Tente novamente.';
        this.sucesso = '';
        console.error(err);
      }
    });
  }
}
