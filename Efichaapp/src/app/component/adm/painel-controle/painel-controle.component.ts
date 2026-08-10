import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserQRCodeReader } from '@zxing/browser';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Administrador } from '../../../models/administrador.model';

import { AuthService } from '../../../services/auth.service';
import { ReservaService } from '../../../services/reservar.service';
import { PostoSaudeService } from '../../../services/posto-saude.service';
import { PainelControlePostoService } from '../../../services/painel-controle-posto.service';


@Component({
  selector: 'app-painel-controle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './painel-controle.component.html',
  styleUrls: ['./painel-controle.component.scss']
})

export class PainelControleComponent implements OnInit {
  @ViewChild('scannerPreview') scannerPreview!: ElementRef<HTMLVideoElement>;

  administrador: Administrador | null = null;
  idPosto: number | null = null;

  fichas: any[] = [];
  totalRecords: number = 0;
  pageSize: number = 5;

  datasDisponiveis: string[] = [];
  novaData: string = '';

  posto: any = null;
  postos: any[] = [];
  recepcionistas: any[] = [];
  novoPosto: any = {
    nome: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    latitude: null,
    longitude: null,
    totalFichas: null,
    fichasDisponiveis: null,
    limiteFichasPorCpf: 1,
    prazoCancelamentoHoras: 24
  };
  postoEditandoId: number | null = null;
  novoRecepcionista: any = {
    nomeCompleto: '',
    cpf: '',
    email: '',
    senha: '',
    idPosto: null as number | null
  };
  recepcionistaEditandoId: number | null = null;
  scannerAtivo = false;
  scannerLoading = false;
  scannerStatus = 'Aguardando leitura do QR Code do comprovante.';
  reservaEscaneada: any = null;
  private qrReader?: BrowserQRCodeReader;
  private scannerControls: { stop?: () => void } | null = null;
  private mediaStream?: MediaStream;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private reservaService: ReservaService,
    private postoService: PostoSaudeService,
    private painelPostoService: PainelControlePostoService
  ) { }

  ngOnInit(): void {
    this.administrador = this.authService.obterAdministrador();
    this.idPosto = this.authService.obterIdPosto();

    if (this.isRecepcionista) {
      this.atualizarFichas(0, this.pageSize);
      this.painelPostoService.getPostos().subscribe(postos => {
        this.posto = postos.find(p => p.id === this.idPosto) || null;
      });

      if (this.idPosto) {
        this.postoService.listarDatas(this.idPosto).subscribe(d => this.datasDisponiveis = d);
      }
    }

    if (this.isAdmin) {
      this.carregarPostos();
      this.carregarRecepcionistas();
    }
  }

  get isAdmin(): boolean {
    return this.administrador?.tipo === 'ADM';
  }

  get isRecepcionista(): boolean {
    return this.administrador?.tipo === 'RECEPCIONISTA';
  }

  onGlobalFilter(event: any, dt: any) {
    dt.filterGlobal(event.target.value, 'contains');
  }

  async alternarScannerQr() {
    if (this.scannerAtivo) {
      this.pararLeituraQr();
      return;
    }

    this.scannerAtivo = false;
    this.scannerLoading = true;
    this.scannerStatus = 'Solicitando acesso à câmera...';
    this.reservaEscaneada = null;

    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      if (!this.scannerPreview?.nativeElement) {
        throw new Error('Elemento de vídeo não encontrado.');
      }

      const videoDevices = await BrowserQRCodeReader.listVideoInputDevices();
      const deviceId = videoDevices.length ? videoDevices[0].deviceId : undefined;

      if (!deviceId) {
        throw new Error('Nenhuma câmera disponível.');
      }

      this.qrReader = new BrowserQRCodeReader();
      this.scannerControls = await this.qrReader.decodeFromVideoDevice(
        deviceId,
        this.scannerPreview.nativeElement,
        (result, error) => {
          if (result) {
            const codigoEscaneado = result.getText();
            this.scannerStatus = `QR lido com sucesso: ${codigoEscaneado}`;
            this.buscarReservaPorQr(codigoEscaneado);
            this.pararLeituraQr();
          }

          if (error && !result) {
            console.debug('Leitura do QR em andamento...', error);
          }
        }
      );

      this.scannerAtivo = true;
      this.scannerLoading = false;
      this.scannerStatus = 'Câmera ativa. Aponte o QR Code do comprovante para o visor.';
    } catch (err) {
      console.error('Erro ao iniciar scanner QR', err);
      this.scannerAtivo = false;
      this.scannerLoading = false;
      this.scannerStatus = 'Não foi possível acessar a câmera do dispositivo.';
      this.messageService.add({
        severity: 'error',
        summary: 'Câmera indisponível',
        detail: 'Verifique as permissões da câmera e tente novamente.'
      });
    }
  }

  private pararLeituraQr() {
    this.scannerControls?.stop?.();
    this.scannerControls = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = undefined;
    }

    if (this.scannerPreview?.nativeElement) {
      this.scannerPreview.nativeElement.srcObject = null;
    }

    this.scannerAtivo = false;
    this.scannerLoading = false;
    this.scannerStatus = 'Câmera desligada.';
  }

  private buscarReservaPorQr(codigoQr: string) {
    this.reservaService.buscarReservaPorQr(codigoQr).subscribe({
      next: (reserva: any) => {
        this.reservaEscaneada = reserva;
        const nomePaciente = reserva?.paciente?.nomeCompleto || reserva?.paciente?.nome || 'Paciente';
        this.messageService.add({
          severity: 'success',
          summary: 'Agendamento identificado',
          detail: `${nomePaciente} foi localizado pelo QR Code do comprovante.`
        });
        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao localizar reserva por QR', err);
        this.messageService.add({
          severity: 'error',
          summary: 'QR inválido',
          detail: err?.error?.erro || 'Não foi possível localizar a reserva pelo QR informado.'
        });
      }
    });
  }

  confirmarFicha(ficha: any) {
    if (ficha.status === 'CANCELADA') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Operação não permitida',
        detail: `A ficha de ${ficha.nome} está cancelada e não pode ser reativada.`
      });
      return;
    }

    this.reservaService.confirmarReservaAdministrador(ficha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ficha confirmada',
          detail: `A ficha de ${ficha.nome} foi confirmada com sucesso`
        });
        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao confirmar ficha', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.mensagem || 'Falha ao confirmar ficha'
        });
      }
    });
  }

  chamarProximo() {
    if (!this.idPosto) return;

    this.reservaService.chamarProximo(this.idPosto).subscribe({
      next: (res: any) => {
        const reserva = res.reserva ?? res;

        this.messageService.add({
          severity: 'info',
          summary: 'Próximo paciente chamado',
          detail: `O paciente ${reserva.paciente?.nomeCompleto || reserva.paciente?.nome} foi chamado com sucesso.`
        });

        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao chamar próximo', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.erro || 'Falha ao chamar próximo paciente'
        });
      }
    });
  }

  registrarCheckin(ficha: any) {
    this.reservaService.registrarCheckin(ficha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Check-in registrado',
          detail: `O check-in de ${ficha.nome} foi registrado com sucesso.`
        });

        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao registrar check-in', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.erro || 'Falha ao registrar check-in'
        });
      }
    });
  }

  finalizarAtendimento(ficha: any) {
    this.reservaService.finalizarAtendimento(ficha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Atendimento finalizado',
          detail: `O atendimento de ${ficha.nome} foi finalizado com sucesso.`
        });

        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao finalizar atendimento', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.erro || 'Falha ao finalizar atendimento'
        });
      }
    });
  }

  marcarNoShow(ficha: any) {

    this.reservaService.marcarNoShow(ficha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Paciente não compareceu',
          detail: `A ficha de ${ficha.nome} foi marcada como não compareceu.`
        });

        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao marcar no-show', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.erro || 'Falha ao marcar no-show'
        });
      }
    });
  }

  cancelarFicha(ficha: any) {
    // if (!confirm(`Deseja realmente cancelar a ficha de ${ficha.nome}?`)) {
    //   return;
    // }

    this.reservaService.cancelarReservaAdministrador(ficha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Ficha cancelada',
          detail: `A ficha de ${ficha.nome} foi cancelada com sucesso.`
        });

        this.atualizarFichas();
      },
      error: (err: any) => {
        console.error('Erro ao cancelar ficha', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.mensagem || 'Falha ao cancelar ficha'
        });
      }
    });
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  atualizarFichas(page: number = 0, size: number = this.pageSize) {
    console.log('Atualizando fichas... page=', page, 'size=', size);
    if (!this.idPosto) {
      this.fichas = [];
      this.totalRecords = 0;
      return;
    }

    this.reservaService.listarPorPostoPaginado(this.idPosto, page, size).subscribe({
      next: (res: any) => {
        const content = res?.content ?? res;
        this.totalRecords = res?.totalElements ?? content.length;
        this.fichas = content.map((r: any, i: number) => ({
          id: r.id,
          pacienteId: r.paciente?.id,
          nome: r.paciente?.nomeCompleto || r.paciente?.nome || '—',
          cpf: r.paciente?.cpf || '—',
          numero: r.numero ?? r.id ?? (page * size) + i + 1,
          dataReserva: r.dataReserva,
          posicaoNaFila: r.posicaoNaFila,
          status: r.status
        }));
      },
      error: (err: any) => {
        console.error('Erro ao carregar reservas', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar reservas' });
      }
    });
  }

  onLazyLoad(event: any) {
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageSize = size;
    this.atualizarFichas(page, size);
  }

  adicionarData() {
    if (!this.novaData || !this.idPosto) {
      return;
    }
    this.postoService.adicionarData(this.idPosto, this.novaData).subscribe({
      next: () => {
        this.datasDisponiveis.push(this.novaData);
        this.novaData = '';
        this.messageService.add({ severity: 'success', summary: 'Data adicionada', detail: 'A data foi disponibilizada aos pacientes.' });
      },
      error: err => {
        console.error('erro adicionando data', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar a data.' });
      }
    });
  }

  excluirData(data: string) {
    if (!this.idPosto) return;
    this.postoService.removerData(this.idPosto, data).subscribe({
      next: () => {
        this.datasDisponiveis = this.datasDisponiveis.filter(d => d !== data);
        this.messageService.add({ severity: 'success', summary: 'Data removida', detail: 'A data foi excluída.' });
      },
      error: err => {
        console.error('erro removendo data', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover a data.' });
      }
    });
  }

  resetarFichas() {
    if (!this.idPosto) return;

    this.messageService.add({
      severity: 'info',
      summary: 'Processando',
      detail: 'Resetando fichas disponíveis...'
    });

    this.postoService.resetarFichas(this.idPosto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Fichas resetadas',
          detail: 'As fichas disponíveis foram resetadas para o total.'
        });

        this.painelPostoService.getPostos().subscribe(postos => {
          this.posto = postos.find(p => p.id === this.idPosto) || null;
        });
      },
      error: (err: any) => {
        console.error('Erro ao resetar fichas', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao resetar fichas.'
        });
      }
    });
  }

  carregarPostos() {
    this.postoService.listar().subscribe({
      next: (postos) => {
        this.postos = postos;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os postos.' });
      }
    });
  }

  salvarPosto() {
    if (!this.novoPosto.nome || !this.novoPosto.endereco || !this.novoPosto.cidade) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha nome, endereço e cidade do posto.' });
      return;
    }

    const payload = {
      ...this.novoPosto,
      latitude: this.novoPosto.latitude ? Number(this.novoPosto.latitude) : null,
      longitude: this.novoPosto.longitude ? Number(this.novoPosto.longitude) : null
    };

    const operacao = this.postoEditandoId
      ? this.postoService.atualizar(this.postoEditandoId, payload)
      : this.postoService.cadastrar(payload);

    operacao.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Posto salvo', detail: 'O posto foi salvo com sucesso.' });
        this.resetarFormularioPosto();
        this.carregarPostos();
      },
      error: (err: any) => {
        console.error('Erro ao salvar posto', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Não foi possível salvar o posto.' });
      }
    });
  }

  editarPosto(posto: any) {
    this.postoEditandoId = posto.id;
    this.novoPosto = { ...posto };
  }

  excluirPosto(postoId: number) {
    this.postoService.excluir(postoId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Posto removido', detail: 'O posto foi removido com sucesso.' });
        this.carregarPostos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover o posto.' });
      }
    });
  }

  resetarFormularioPosto() {
    this.postoEditandoId = null;
    this.novoPosto = {
      nome: '',
      endereco: '',
      bairro: '',
      cidade: '',
      estado: '',
      telefone: '',
      latitude: null,
      longitude: null,
      totalFichas: null,
      fichasDisponiveis: null,
      limiteFichasPorCpf: 1,
      prazoCancelamentoHoras: 24
    };
  }

  carregarRecepcionistas() {
    this.authService.listarRecepcionistas().subscribe({
      next: (recepcionistas) => {
        this.recepcionistas = recepcionistas;
      },
      error: (err: any) => {
        console.error('Erro ao carregar recepcionistas', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Não foi possível carregar os recepcionistas.' });
      }
    });
  }

  salvarRecepcionista() {
    if (!this.novoRecepcionista.nomeCompleto || !this.novoRecepcionista.cpf || !this.novoRecepcionista.email || !this.novoRecepcionista.senha) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios do recepcionista.' });
      return;
    }

    if (!this.novoRecepcionista.idPosto) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Associe o recepcionista a um posto de saúde.' });
      return;
    }

    const payload = {
      ...this.novoRecepcionista,
      cpf: String(this.novoRecepcionista.cpf).replace(/\D/g, ''),
      idPosto: Number(this.novoRecepcionista.idPosto)
    };

    const operacao = this.recepcionistaEditandoId
      ? this.authService.atualizarRecepcionista(this.recepcionistaEditandoId, payload)
      : this.authService.cadastrarRecepcionista(payload);

    operacao.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Recepcionista salvo', detail: 'O recepcionista foi salvo com sucesso.' });
        this.resetarFormularioRecepcionista();
        this.carregarRecepcionistas();
      },
      error: (err: any) => {
        console.error('Erro ao salvar recepcionista', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Não foi possível salvar o recepcionista.' });
      }
    });
  }

  editarRecepcionista(recepcionista: any) {
    this.recepcionistaEditandoId = recepcionista.id;
    this.novoRecepcionista = {
      ...recepcionista,
      senha: ''
    };
  }

  excluirRecepcionista(recepcionistaId: number) {
    this.authService.excluirRecepcionista(recepcionistaId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Recepcionista removido', detail: 'O recepcionista foi removido com sucesso.' });
        this.carregarRecepcionistas();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover o recepcionista.' });
      }
    });
  }

  resetarFormularioRecepcionista() {
    this.recepcionistaEditandoId = null;
    this.novoRecepcionista = {
      nomeCompleto: '',
      cpf: '',
      email: '',
      senha: '',
      idPosto: null as number | null
    };
  }
}


