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
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

    // 🔹 Listar todas as reservas
    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
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

        // verifica disponibilidade de data
        if (posto.getDatasDisponiveis() == null || !posto.getDatasDisponiveis().contains(dataSelecionada)) {
            throw new RuntimeException("Data não disponível");
        }

        // decrementa fichas e remove a data usada
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
        return reservaRepository.findAll()
                .stream()
                .filter(r -> r.getPaciente() != null && r.getPaciente().getId().equals(id))
                .toList();
    }

    // 🔹 CANCELAR RESERVA
    @PutMapping("/{reservaId}/cancelar/{pacienteId}")
    public ResponseEntity<?> cancelarReserva(
            @PathVariable Long reservaId,
            @PathVariable Long pacienteId) {

        reservaService.cancelarReserva(reservaId, pacienteId);

        return ResponseEntity.ok().body(
                java.util.Map.of("mensagem", "Reserva cancelada com sucesso")
        );
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
