import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-painel-controle',
  imports: [CommonModule],
  templateUrl: './painel-controle.component.html',
  styleUrl: './painel-controle.component.scss'
})
export class PainelControleComponent {
  fichas = [
    { nome: 'Maria Eduarda', cpf: '999.999.999.89', numero: 1 },
    { nome: 'Maria Eduarda', cpf: '999.999.999.89', numero: 1 },
    { nome: 'Maria Eduarda', cpf: '999.999.999.89', numero: 1 },
  ];
}

