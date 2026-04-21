import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Posto {
  id:number;
  nome: string;
  endereco: string;
  capacidadeDiaria: number;
}

@Injectable({
  providedIn: 'root'
})

export class PainelControlePostoService {

  private apiUrl = 'http://localhost:8080/postos/listar';

  getPostos(): Observable<Posto[]> {
    return this.http.get<Posto[]>(this.apiUrl);
  }

  constructor(private http: HttpClient) { }
}
