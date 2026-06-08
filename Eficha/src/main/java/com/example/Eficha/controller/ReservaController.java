package com.example.Eficha.controller;

import com.example.Eficha.model.Reserva;
import com.example.Eficha.repository.ReservaRepository;
import com.example.Eficha.repository.PostoSaudeRepository;
import com.example.Eficha.service.ReservaPdfService;
import com.example.Eficha.service.ReservaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PostoSaudeRepository postoSaudeRepository;

    @Autowired
    private ReservaPdfService reservaPdfService;

    @Autowired
    private ReservaService reservaService;

    // 🔹 Listar todas as reservas
    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    // 🔹 NOVO ENDPOINT - Reservar ficha com data
    @PostMapping("/nova")
    public ResponseEntity<?> reservarNovaFicha(@RequestBody Map<String, Object> payload) {
        try {
            Long pacienteId = payload.get("pacienteId") == null ? null
                    : Long.valueOf(payload.get("pacienteId").toString());
            Long postoId = payload.get("postoId") == null ? null : Long.valueOf(payload.get("postoId").toString());
            String data = payload.get("dataReserva") == null ? null : payload.get("dataReserva").toString();

            LocalDate dataReserva = data != null ? LocalDate.parse(data) : null;
            var resposta = reservaService.reservarFicha(pacienteId, postoId, dataReserva);
            return ResponseEntity.ok(resposta);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Formato de data inválido"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // 🔹 Emitir ficha manualmente pelo posto
    @PostMapping("/manual")
    public ResponseEntity<?> emitirFichaManual(@RequestBody Map<String, Object> payload) {
        try {
            String nome = payload.get("nomeCompleto") == null ? null : payload.get("nomeCompleto").toString();
            String cpf = payload.get("cpf") == null ? null : payload.get("cpf").toString();
            Long postoId = payload.get("postoId") == null ? null : Long.valueOf(payload.get("postoId").toString());
            String data = payload.get("dataReserva") == null ? null : payload.get("dataReserva").toString();
            LocalDate dataReserva = data != null ? LocalDate.parse(data) : LocalDate.now();
            var resposta = reservaService.emitirFichaManual(nome, cpf, postoId, dataReserva);
            return ResponseEntity.ok(resposta);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Formato de data inválido"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // 🔹 Criar reserva (fluxo antigo - se ainda usar)
    @PostMapping
    public Reserva criarReserva(@RequestBody Reserva reserva) {

        if (reserva.getDataReserva() == null) {
            throw new RuntimeException("Selecione uma data para a reserva.");
        }

        Long pacienteId = reserva.getPaciente().getId();
        LocalDate dataSelecionada = reserva.getDataReserva();

        if (reservaRepository.existsByPacienteIdAndDataReserva(pacienteId, dataSelecionada)) {
            throw new RuntimeException("Você já possui uma reserva para esta data.");
        }

        var posto = postoSaudeRepository
                .findById(reserva.getPostoSaude().getId())
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));

        if (posto.getFichasDisponiveis() <= 0) {
            throw new RuntimeException("Não há fichas disponíveis");
        }

        if (posto.getDatasDisponiveis() == null || !posto.getDatasDisponiveis().contains(dataSelecionada)) {
            throw new RuntimeException("Data não disponível");
        }

        posto.setFichasDisponiveis(posto.getFichasDisponiveis() - 1);
        posto.getDatasDisponiveis().remove(dataSelecionada);
        postoSaudeRepository.save(posto);

        return reservaRepository.save(reserva);
    }

    // 🔹 Listar reservas por posto
    @GetMapping("/por-posto/{id}")
    public List<Reserva> listarReservasPorPosto(@PathVariable Long id) {
        return reservaRepository.findAll()
                .stream()
                .filter(r -> r.getPostoSaude() != null && r.getPostoSaude().getId().equals(id))
                .collect(Collectors.toList());
    }

    // 🔹 Listar reservas por posto (paginado)
    @GetMapping("/por-posto/{id}/paged")
    public Page<Reserva> listarReservasPorPostoPaged(@PathVariable Long id, Pageable pageable) {
        return reservaRepository.findByPostoSaudeId(id, pageable);
    }

    // 🔹 Listar reservas por paciente
    @GetMapping("/por-paciente/{id}")
    public List<Reserva> listarPorPaciente(@PathVariable Long id) {
        return reservaService.listarPorPaciente(id);
    }

    // 🔹 Chamar próximo da fila
    @PutMapping("/posto/{postoId}/chamar-proximo")
    public ResponseEntity<?> chamarProximo(@PathVariable Long postoId) {
        try {
            Reserva proximo = reservaService.chamarProximoFila(postoId);
            return ResponseEntity.ok(Map.of("mensagem", "Próximo chamado com sucesso", "reserva", proximo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // 🔹 Check-in do paciente
    @PutMapping("/{reservaId}/checkin")
    public ResponseEntity<?> checkinReserva(@PathVariable Long reservaId) {
        reservaService.registrarCheckin(reservaId);
        return ResponseEntity.ok(Map.of("mensagem", "Check-in registrado com sucesso"));
    }

    // 🔹 Registrar atendimento realizado
    @PutMapping("/{reservaId}/finalizar")
    public ResponseEntity<?> finalizarAtendimento(@PathVariable Long reservaId) {
        reservaService.registrarAtendimento(reservaId);
        return ResponseEntity.ok(Map.of("mensagem", "Atendimento registrado com sucesso"));
    }

    // 🔹 Marcar não comparecimento
    @PutMapping("/{reservaId}/no-show")
    public ResponseEntity<?> marcarNoShow(@PathVariable Long reservaId) {
        reservaService.marcarNoShow(reservaId);
        return ResponseEntity.ok(Map.of("mensagem", "Ficha marcada como no-show"));
    }

    // 🔹 CANCELAR RESERVA - PACIENTE
    @PutMapping("/{reservaId}/cancelar/{pacienteId}")
    public ResponseEntity<?> cancelarReserva(
            @PathVariable Long reservaId,
            @PathVariable Long pacienteId) {

        reservaService.cancelarReserva(reservaId, pacienteId);

        return ResponseEntity.ok().body(
                Map.of("mensagem", "Reserva cancelada com sucesso"));
    }

    // 🔹 CANCELAR RESERVA - ADMINISTRADOR
    @PutMapping("/{reservaId}/cancelar")
    public ResponseEntity<?> cancelarReservaPorAdministrador(@PathVariable Long reservaId) {

        reservaService.cancelarReservaPorAdministrador(reservaId);

        return ResponseEntity.ok().body(
                Map.of("mensagem", "Reserva cancelada com sucesso"));
    }

    // 🔹 CONFIRMAR RESERVA - ADMINISTRADOR
    @PutMapping("/{reservaId}/confirmar")
    public ResponseEntity<?> confirmarReservaPorAdministrador(@PathVariable Long reservaId) {

        reservaService.confirmarReservaPorAdministrador(reservaId);

        return ResponseEntity.ok().body(
                Map.of("mensagem", "Reserva confirmada com sucesso"));
    }

    // 🔹 DOWNLOAD DO COMPROVANTE (PDF)
    @GetMapping("/{id}/comprovante")
    public ResponseEntity<byte[]> baixarComprovante(@PathVariable Long id) {

        byte[] pdf = reservaPdfService.gerarComprovante(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=comprovante_reserva_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
