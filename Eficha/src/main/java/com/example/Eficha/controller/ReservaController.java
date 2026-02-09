package com.example.Eficha.controller;

import com.example.Eficha.model.Reserva;
import com.example.Eficha.model.StatusReserva;
import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.repository.ReservaRepository;
import com.example.Eficha.repository.PostoSaudeRepository;
import com.example.Eficha.service.ReservaPdfService;
import com.example.Eficha.service.ReservaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PostoSaudeRepository postoSaudeRepository;

    @Autowired
    private ReservaPdfService reservaPdfService;

    @Autowired
    private ReservaService reservaService;

    // 🔹 LISTAR TODAS
    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    // 🔹 CRIAR RESERVA (PACIENTE)
    @PostMapping
    public Reserva criarReserva(@RequestBody Reserva reserva) {

        if (reserva.getDataReserva() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione uma data para a reserva");
        }

        Long pacienteId = reserva.getPaciente().getId();
        LocalDate dataSelecionada = reserva.getDataReserva();

        if (reservaRepository.existsByPacienteIdAndDataReserva(pacienteId, dataSelecionada)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Você já possui uma reserva para esta data");
        }

        // valida posto
        postoSaudeRepository.findById(reserva.getPostoSaude().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Posto não encontrado"));

        // 🔥 STATUS INICIAL
        reserva.setStatus(StatusReserva.AGUARDO);

        return reservaRepository.save(reserva);
    }

    // 🔹 CONFIRMAR RESERVA (ADMIN)
    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarReserva(@PathVariable Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva não encontrada"));

        if (reserva.getStatus() != StatusReserva.AGUARDO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Apenas reservas em AGUARDO podem ser confirmadas");
        }

        PostoSaude posto = reserva.getPostoSaude();

        if (posto.getFichasDisponiveis() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não há fichas disponíveis para este posto");
        }

        // desconta ficha somente agora
        posto.setFichasDisponiveis(posto.getFichasDisponiveis() - 1);
        postoSaudeRepository.save(posto);

        reserva.setStatus(StatusReserva.CONFIRMADA);
        reservaRepository.save(reserva);

        return ResponseEntity.ok(
                java.util.Map.of("mensagem", "Reserva confirmada com sucesso"));
    }

    // 🔹 LISTAR POR POSTO
    @GetMapping("/por-posto/{id}")
    public List<Reserva> listarReservasPorPosto(@PathVariable Long id) {
        return reservaRepository.findAll()
                .stream()
                .filter(r -> r.getPostoSaude() != null &&
                             r.getPostoSaude().getId().equals(id))
                .collect(Collectors.toList());
    }

    // 🔹 LISTAR POR POSTO (PAGINADO)
    @GetMapping("/por-posto/{id}/paged")
    public Page<Reserva> listarReservasPorPostoPaged(
            @PathVariable Long id,
            Pageable pageable) {
        return reservaRepository.findByPostoSaudeId(id, pageable);
    }

    // 🔹 LISTAR POR PACIENTE
    @GetMapping("/por-paciente/{id}")
    public List<Reserva> listarPorPaciente(@PathVariable Long id) {
        return reservaRepository.findAll()
                .stream()
                .filter(r -> r.getPaciente() != null &&
                             r.getPaciente().getId().equals(id))
                .toList();
    }

    // 🔹 CANCELAR RESERVA
    @PutMapping("/{reservaId}/cancelar/{pacienteId}")
    public ResponseEntity<?> cancelarReserva(
            @PathVariable Long reservaId,
            @PathVariable Long pacienteId) {

        reservaService.cancelarReserva(reservaId, pacienteId);

        return ResponseEntity.ok(
                java.util.Map.of("mensagem", "Reserva cancelada com sucesso"));
    }

    // 🔹 DOWNLOAD COMPROVANTE
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
