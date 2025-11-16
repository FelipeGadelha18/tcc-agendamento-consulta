import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  cadastroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  salvar() {
    if (this.cadastroForm.valid) {
      // substituir por integração/API real se desejar
      console.log('Dados enviados:', this.cadastroForm.value);
      alert('Cadastro enviado (veja console)'); 
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }
}
