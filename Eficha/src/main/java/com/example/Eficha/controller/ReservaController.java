package com.example.Eficha.controller;


import com.example.Eficha.model.Reserva;
import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.repository.ReservaRepository;
import com.example.Eficha.repository.PostoSaudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    // 🔹 Cadastrar nova reserva
    @PostMapping
    public Reserva criarReserva(@RequestBody Reserva reserva) {
        // Verifica se o posto existe
        PostoSaude posto = postoSaudeRepository.findById(reserva.getPostoSaude().getId())
                .orElseThrow(() -> new RuntimeException("Posto de saúde não encontrado."));

        // Verifica se há fichas disponíveis
        if (posto.getFichasDisponiveis() <= 0) {
            throw new RuntimeException("Não há fichas disponíveis neste posto.");
        }

        // Reduz uma ficha disponível
        posto.setFichasDisponiveis(posto.getFichasDisponiveis() - 1);
        postoSaudeRepository.save(posto);

        // Salva a reserva
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
}
