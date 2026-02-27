import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostoSaudeService {

  private apiUrl = 'http://localhost:8080/postos';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  listarDatas(postoId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${postoId}/datas`);
  }

  adicionarData(postoId: number, data: string) {
    // envia objeto para compatibilidade com DTO do backend
    return this.http.post(`${this.apiUrl}/${postoId}/datas`, { data });
  }

  removerData(postoId: number, data: string) {
    // date deve ser string ISO, encodeURIComponent para segurança
    return this.http.delete(`${this.apiUrl}/${postoId}/datas/${encodeURIComponent(data)}`);
  }
}
