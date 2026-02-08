package com.example.Eficha.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import com.example.Eficha.model.*;
import com.example.Eficha.repository.*;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PostoSaudeRepository postoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // =========================
    // RESERVAR FICHA
    // =========================
    public Map<String, Object> reservarFicha(Long pacienteId, Long postoId) {

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        PostoSaude posto = postoRepository.findById(postoId)
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));

        LocalDate hoje = LocalDate.now();

        // Verifica se já possui reserva no dia
        if (reservaRepository.existsByPacienteIdAndDataReserva(pacienteId, hoje)) {
            throw new RuntimeException("O paciente já possui uma reserva para hoje.");
        }

        // Verifica fichas disponíveis
        if (posto.getFichasDisponiveis() <= 0) {
            throw new RuntimeException("Não há fichas disponíveis neste posto.");
        }

        // Cria reserva
        Reserva reserva = new Reserva();
        reserva.setDataReserva(hoje);
        reserva.setPaciente(paciente);
        reserva.setPostoSaude(posto);
        reserva.setStatus(StatusReserva.CONFIRMADA);

        reservaRepository.save(reserva);

        // Atualiza fichas restantes
        posto.setFichasDisponiveis(posto.getFichasDisponiveis() - 1);
        postoRepository.save(posto);

        // Retorno
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("mensagem", "Reserva feita com sucesso!");
        resposta.put("dataReserva", reserva.getDataReserva());
        resposta.put("nomePaciente", paciente.getNomeCompleto());
        resposta.put("posto", Map.of(
                "nome", posto.getNome(),
                "endereco", posto.getEndereco(),
                "bairro", posto.getBairro(),
                "cidade", posto.getCidade(),
                "estado", posto.getEstado(),
                "telefone", posto.getTelefone()
        ));
        resposta.put("fichasRestantes", posto.getFichasDisponiveis());

        return resposta;
    }

    // =========================
    // CANCELAR FICHA
    // =========================
    public void cancelarReserva(Long reservaId, Long pacienteId) {

        Reserva reserva = reservaRepository
                .findByIdAndPacienteId(reservaId, pacienteId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        // Impede cancelamento duplicado
        if (reserva.getStatus() == StatusReserva.CANCELADA) {
            throw new RuntimeException("Esta reserva já foi cancelada");
        }

        // Atualiza status
        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);

        // Devolve ficha ao posto
        PostoSaude posto = reserva.getPostoSaude();
        posto.setFichasDisponiveis(posto.getFichasDisponiveis() + 1);
        postoRepository.save(posto);
    }
}
