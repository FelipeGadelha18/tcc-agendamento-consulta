package com.example.Eficha.controller;

import com.example.Eficha.model.Reserva;
import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.repository.ReservaRepository;
import com.example.Eficha.repository.PostoSaudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    // 🔹 Listar todas as reservas
    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

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

        PostoSaude posto = postoSaudeRepository
                .findById(reserva.getPostoSaude().getId())
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));

        if (posto.getFichasDisponiveis() <= 0) {
            throw new RuntimeException("Não há fichas disponíveis");
        }

        posto.setFichasDisponiveis(posto.getFichasDisponiveis() - 1);
        postoSaudeRepository.save(posto);

        return reservaRepository.save(reserva);
    }

    // 🔹 Listar reservas de um posto específico
    @GetMapping("/por-posto/{id}")
    public List<Reserva> listarReservasPorPosto(@PathVariable Long id) {
        return reservaRepository.findAll()
                .stream()
                .filter(r -> r.getPostoSaude() != null && r.getPostoSaude().getId().equals(id))
                .collect(Collectors.toList());
    }

    @GetMapping("/por-paciente/{id}")
    public List<Reserva> listarPorPaciente(@PathVariable Long id) {
        return reservaRepository.findAll()
                .stream()
                .filter(r -> r.getPaciente() != null && r.getPaciente().getId().equals(id))
                .toList();
    }

}
