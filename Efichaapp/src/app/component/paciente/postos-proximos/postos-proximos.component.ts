import { Component, AfterViewInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-postos-proximos',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './postos-proximos.component.html',
  styleUrls: ['./postos-proximos.component.scss']
})
export class PostosProximosComponent implements AfterViewInit {

  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];

  private map!: L.Map;
  private marcadorUsuario!: L.Marker;
  private marcadoresPostos: L.Marker[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.configurarMenu();
  }

  ngAfterViewInit() {
    this.inicializarMapa();
    this.pegarLocalizacaoUsuario();
    this.carregarPostos();
  }

  configurarMenu() {
    this.items = [
      {
        label: 'Início',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/paciente/inicio'])
      },
      {
        label: 'Minhas Fichas',
        icon: 'pi pi-receipt',
        command: () => this.router.navigate(['/paciente/minhas-fichas'])
      },
      {
        label: 'Reservar ficha',
        icon: 'pi pi-calendar-plus',
        command: () => this.router.navigate(['/paciente/reservar-ficha'])
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/paciente/perfil'])
      }
    ];
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
      .subscribe(async postos => {
        this.limparMarcadoresPostos();

        const marcacoes = await Promise.all(postos.map(async posto => {
          const enderecoCompleto = `${posto.endereco || ''}, ${posto.bairro || ''}, ${posto.cidade || ''}, ${posto.estado || ''}`.replace(/,\s+/g, ', ').replace(/, $/, '');

          const coords = this.obterCoordenadasDoPosto(posto);
          const ponto = coords ?? await this.geocodificarEndereco(enderecoCompleto);
          if (!ponto) {
            return null;
          }

          const marker = L.marker([ponto.lat, ponto.lon], {
            icon: this.criarIconePosto(posto.fichasDisponiveis > 0)
          }).addTo(this.map);

          marker.bindPopup(`
            <div class="map-popup">
              <strong>${posto.nome}</strong><br>
              <span>${enderecoCompleto || 'Endereço não informado'}</span><br>
              <small>Fichas disponíveis: ${posto.fichasDisponiveis ?? 0}</small>
            </div>
          `);

          this.marcadoresPostos.push(marker);
          return marker;
        }));

        const coordsValidas = marcacoes.filter((m): m is L.Marker => Boolean(m));
        if (coordsValidas.length > 0) {
          const group = L.featureGroup(coordsValidas);
          this.map.fitBounds(group.getBounds().pad(0.2));
        }
      });
  }

  private obterCoordenadasDoPosto(posto: any): { lat: number; lon: number } | null {
    const lat = Number(posto.latitude ?? posto.lat);
    const lon = Number(posto.longitude ?? posto.lon);

    if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
      return { lat, lon };
    }

    return null;
  }

  private criarIconePosto(disponivel: boolean) {
    return L.divIcon({
      html: `<div class="map-marker ${disponivel ? 'map-marker--ativo' : 'map-marker--indisponivel'}"></div>`,
      className: 'map-marker-wrapper',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  }

  private limparMarcadoresPostos() {
    this.marcadoresPostos.forEach(marker => this.map.removeLayer(marker));
    this.marcadoresPostos = [];
  }

  async geocodificarEndereco(endereco: string): Promise<{ lat: number; lon: number }> {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;

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
