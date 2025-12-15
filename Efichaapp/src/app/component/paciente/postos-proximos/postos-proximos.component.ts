import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-postos-proximos',
  standalone: true,
  templateUrl: './postos-proximos.component.html',
  styleUrls: ['./postos-proximos.component.scss']
})
export class PostosProximosComponent implements AfterViewInit {

  private map!: L.Map;
  private marcadorUsuario!: L.Marker;

  ngAfterViewInit() {
    this.inicializarMapa();
    this.localizarUsuario();
  }

  inicializarMapa() {
    this.map = L.map('map').setView([-9.97499, -67.8243], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  localizarUsuario() {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador');
      return;
    }

    navigator.geolocation.watchPosition(
      (posicao) => {
        const lat = posicao.coords.latitude;
        const lng = posicao.coords.longitude;

        // Centraliza o mapa na posição do usuário
        this.map.setView([lat, lng], 15);

        // Se já existir marcador, remove
        if (this.marcadorUsuario) {
          this.map.removeLayer(this.marcadorUsuario);
        }

        // Cria marcador do usuário
        this.marcadorUsuario = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [35, 35],
            iconAnchor: [17, 34]
          })
        })
        .addTo(this.map)
        .bindPopup('📍 Você está aqui')
        .openPopup();
      },
      (erro) => {
        console.error(erro);
        alert('Não foi possível obter sua localização');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    );
  }
}
