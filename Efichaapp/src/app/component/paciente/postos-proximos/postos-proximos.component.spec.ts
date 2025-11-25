import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-postos-proximos',
  standalone: true,
  imports: [HttpClientModule], // 🔥 IMPORTANTE
  templateUrl: './postos-proximos.component.html',
  styleUrls: ['./postos-proximos.component.scss']
})
export class PostosProximosComponent implements AfterViewInit {

  private map: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.inicializarMapa();
    this.carregarPostos();
  }

  inicializarMapa() {
    this.map = L.map('map').setView([-9.97499, -67.8243], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  carregarPostos() {
    this.http.get('http://localhost:8080/postos/listar')
      .subscribe((postos: any) => {

        postos.forEach((posto: any) => {
          const enderecoCompleto =
            `${posto.endereco}, ${posto.bairro}, ${posto.cidade}, ${posto.estado}`;

          this.geocodificarEndereco(enderecoCompleto)
            .then(coords => {
              L.marker([coords.lat, coords.lon])
                .addTo(this.map)
                .bindPopup(`<b>${posto.nome}</b><br>${enderecoCompleto}`);
            });
        });
      });
  }

  async geocodificarEndereco(endereco: string): Promise<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;

    const result: any = await fetch(url).then(r => r.json());

    if (result.length > 0) {
      return { lat: result[0].lat, lon: result[0].lon };
    }

    return { lat: -9.97499, lon: -67.8243 }; // fallback
  }
}
