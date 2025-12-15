import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-postos-proximos',
  standalone: true,
  templateUrl: './postos-proximos.component.html',
  styleUrls: ['./postos-proximos.component.scss']
})
export class PostosProximosComponent implements AfterViewInit {

  private map!: L.Map;
  private marcadorUsuario!: L.Marker;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.inicializarMapa();
    this.pegarLocalizacaoUsuario();
    this.carregarPostos();
  }

  inicializarMapa() {
    this.map = L.map('map').setView([-9.97499, -67.8243], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  pegarLocalizacaoUsuario() {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
      return;
    }

    navigator.geolocation.watchPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      if (this.marcadorUsuario) {
        this.marcadorUsuario.setLatLng([lat, lon]);
      } else {
        this.marcadorUsuario = L.marker([lat, lon], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
        })
          .addTo(this.map)
          .bindPopup('📍 Você está aqui');
      }

      this.map.setView([lat, lon], 14);
    });
  }

  carregarPostos() {
    this.http.get<any[]>('http://localhost:8080/postos/listar')
      .subscribe(postos => {
        postos.forEach(posto => {
          const enderecoCompleto =
            `${posto.endereco}, ${posto.bairro}, ${posto.cidade}, ${posto.estado}`;

          this.geocodificarEndereco(enderecoCompleto)
            .then(coords => {

              const popupHtml = `
                <b>${posto.nome}</b><br>
                ${enderecoCompleto}<br><br>
                <button 
                  id="btn-reservar-${posto.id}" 
                  style="
                    padding:6px 10px;
                    background:#1976d2;
                    color:#fff;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                  ">
                  Reservar ficha
                </button>
              `;

              const marker = L.marker([coords.lat, coords.lon]).addTo(this.map);
              marker.bindPopup(popupHtml);

              // 🔥 Quando abrir o popup, liga o botão
              marker.on('popupopen', () => {
                const btn = document.getElementById(`btn-reservar-${posto.id}`);
                if (btn) {
                  btn.onclick = () => {
                    this.router.navigate(
                      ['/paciente/reservar-ficha'],
                      { queryParams: { postoId: posto.id } }
                    );
                  };
                }
              });
            });
        });
      });
  }

  async geocodificarEndereco(endereco: string): Promise<{ lat: number; lon: number }> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;

    const result: any[] = await fetch(url, {
      headers: { 'User-Agent': 'EfichaApp' }
    }).then(r => r.json());

    if (result.length > 0) {
      return {
        lat: parseFloat(result[0].lat),
        lon: parseFloat(result[0].lon)
      };
    }

    return { lat: -9.97499, lon: -67.8243 };
  }
}
