package com.example.Eficha.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
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

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // =========================
    // RESERVAR FICHA
    // =========================
    public Map<String, Object> reservarFicha(Long pacienteId, Long postoId, LocalDate dataReserva) {

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        PostoSaude posto = postoRepository.findById(postoId)
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));

        LocalDate data = dataReserva != null ? dataReserva : LocalDate.now();

        // Verifica data bloqueada
        if (posto.getDatasBloqueadas() != null && posto.getDatasBloqueadas().contains(data)) {
            throw new RuntimeException("A data informada está bloqueada para este posto.");
        }

        // Verifica se a data está disponível
        if (posto.getDatasDisponiveis() == null || !posto.getDatasDisponiveis().contains(data)) {
            throw new RuntimeException("Data não disponível para este posto.");
        }

        // Verifica se já possui reserva na mesma data
        if (reservaRepository.existsByPacienteIdAndDataReserva(pacienteId, data)) {
            throw new RuntimeException("O paciente já possui uma reserva para esta data.");
        }

        // Verifica limite de fichas por CPF
        List<Reserva> reservasMesmoCpf = reservaRepository.findByPacienteIdAndDataReserva(pacienteId, data);
        int limiteFichasPorCpf = posto.getLimiteFichasPorCpf();
        if (limiteFichasPorCpf <= 0) {
            limiteFichasPorCpf = Integer.MAX_VALUE;
        }
        if (reservasMesmoCpf.size() >= limiteFichasPorCpf) {
            throw new RuntimeException("Limite de fichas por CPF para esta data excedido.");
        }

        // Verifica fichas disponíveis
        if (posto.getFichasDisponiveis() <= 0) {
            throw new RuntimeException("Não há fichas disponíveis neste posto.");
        }

        Reserva reserva = new Reserva();
        reserva.setDataReserva(data);
        reserva.setPaciente(paciente);
        reserva.setPostoSaude(posto);
        reserva.setStatus(StatusReserva.PENDENTE);

        reservaRepository.save(reserva);

        posto.setFichasDisponiveis(posto.getFichasDisponiveis() - 1);
        postoRepository.save(posto);

        int posicao = calcularPosicaoNaFila(reserva);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("mensagem", "Reserva feita com sucesso! A ficha está aguardando confirmação do posto.");
        resposta.put("dataReserva", reserva.getDataReserva());
        resposta.put("posicaoFila", posicao);
        resposta.put("nomePaciente", paciente.getNomeCompleto());
        resposta.put("posto", Map.of(
                "nome", posto.getNome(),
                "endereco", posto.getEndereco(),
                "bairro", posto.getBairro(),
                "cidade", posto.getCidade(),
                "estado", posto.getEstado(),
                "telefone", posto.getTelefone()));
        resposta.put("fichasRestantes", posto.getFichasDisponiveis());

        return resposta;
    }

    public List<Reserva> listarPorPaciente(Long pacienteId) {
        List<Reserva> reservas = reservaRepository.findByPacienteId(pacienteId);
        if (reservas == null) {
            return new ArrayList<>();
        }
        reservas.forEach(r -> {
            if (r.getDataReserva() != null) {
                r.setPosicaoNaFila(calcularPosicaoNaFila(r));
            }
        });
        return reservas;
    }

    public int calcularPosicaoNaFila(Reserva reserva) {
        if (reserva == null || reserva.getPostoSaude() == null || reserva.getDataReserva() == null) {
            return 0;
        }

        List<Reserva> fila = reservaRepository.findByPostoSaudeAndDataReserva(reserva.getPostoSaude(),
                reserva.getDataReserva());
        if (fila == null) {
            return 0;
        }

        List<Reserva> ordenada = fila.stream()
                .filter(r -> r.getStatus() == StatusReserva.PENDENTE
                        || r.getStatus() == StatusReserva.CONFIRMADA
                        || r.getStatus() == StatusReserva.CHAMADO)
                .sorted(Comparator.comparing(Reserva::getDataCriacao))
                .toList();

        for (int i = 0; i < ordenada.size(); i++) {
            if (ordenada.get(i).getId().equals(reserva.getId())) {
                return i + 1;
            }
        }
        return 0;
    }

    // =========================
    // CANCELAR FICHA
    // =========================
    public void cancelarReserva(Long reservaId, Long pacienteId) {
        Reserva reserva = reservaRepository
                .findByIdAndPacienteId(reservaId, pacienteId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));
        executarCancelamento(reserva);
    }

    public void cancelarReservaPorAdministrador(Long reservaId) {
        Reserva reserva = reservaRepository
                .findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));
        executarCancelamento(reserva);
    }

    public void confirmarReservaPorAdministrador(Long reservaId) {
        Reserva reserva = reservaRepository
                .findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reserva.getStatus() == StatusReserva.CANCELADA || reserva.getStatus() == StatusReserva.NO_SHOW) {
            throw new RuntimeException("Reserva cancelada ou ausente não pode ser reativada.");
        }

        if (reserva.getStatus() == StatusReserva.UTILIZADA) {
            throw new RuntimeException("Reserva utilizada não pode ser alterada");
        }

        if (reserva.getStatus() == StatusReserva.PENDENTE) {
            reserva.setStatus(StatusReserva.CONFIRMADA);
            reservaRepository.save(reserva);
            return;
        }

        if (reserva.getStatus() == StatusReserva.CHAMADO) {
            return;
        }

        throw new RuntimeException("Status inválido para confirmação: " + reserva.getStatus());
    }

    public Reserva chamarProximoFila(Long postoId) {
        List<StatusReserva> prioridades = List.of(StatusReserva.CHAMADO, StatusReserva.CONFIRMADA,
                StatusReserva.PENDENTE);
        List<Reserva> fila = reservaRepository.findByPostoSaudeIdAndStatusInOrderByDataCriacaoAsc(postoId,
                List.of(StatusReserva.PENDENTE, StatusReserva.CONFIRMADA));

        if (fila.isEmpty()) {
            throw new RuntimeException("Não há pacientes na fila para este posto.");
        }

        Reserva proximo = fila.get(0);
        proximo.setStatus(StatusReserva.CHAMADO);
        reservaRepository.save(proximo);
        return proximo;
    }

    public void registrarCheckin(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reserva.getStatus() == StatusReserva.CANCELADA || reserva.getStatus() == StatusReserva.NO_SHOW) {
            throw new RuntimeException("Não é possível fazer check-in dessa reserva.");
        }

        reserva.setStatus(StatusReserva.CHAMADO);
        reservaRepository.save(reserva);
    }

    public void registrarAtendimento(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reserva.getStatus() == StatusReserva.CANCELADA || reserva.getStatus() == StatusReserva.NO_SHOW) {
            throw new RuntimeException("Não é possível finalizar atendimento desta reserva.");
        }

        reserva.setStatus(StatusReserva.UTILIZADA);
        reservaRepository.save(reserva);
    }

    public void marcarNoShow(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reserva.getStatus() == StatusReserva.UTILIZADA) {
            throw new RuntimeException("Reserva já foi atendida e não pode ser marcada como ausente.");
        }

        reserva.setStatus(StatusReserva.NO_SHOW);
        reservaRepository.save(reserva);
    }

    public Map<String, Object> emitirFichaManual(String nomeCompleto, String cpf, Long postoId, LocalDate dataReserva) {
        if (nomeCompleto == null || nomeCompleto.isBlank() || cpf == null || cpf.isBlank()) {
            throw new RuntimeException("Nome e CPF são obrigatórios para emissão manual.");
        }

        Paciente paciente = pacienteRepository.findByCpf(cpf);
        if (paciente == null) {
            paciente = new Paciente();
            paciente.setNomeCompleto(nomeCompleto);
            paciente.setCpf(cpf);
            paciente.setTelefone("00000000000");
            paciente.setEmail(cpf + "@nao-informado.com");
            paciente.setEndereco("Informação não disponível");
            paciente.setNumeroCasa("S/N");
            paciente.setSenha(encoder.encode("manual123"));
            pacienteRepository.save(paciente);
        }

        return reservarFicha(paciente.getId(), postoId, dataReserva);
    }

    private void executarCancelamento(Reserva reserva) {
        if (reserva.getStatus() == StatusReserva.CANCELADA) {
            return;
        }

        if (reserva.getStatus() == StatusReserva.UTILIZADA) {
            throw new RuntimeException("Não é possível cancelar uma ficha já utilizada");
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);

        PostoSaude posto = reserva.getPostoSaude();
        posto.setFichasDisponiveis(posto.getFichasDisponiveis() + 1);
        postoRepository.save(posto);
    }
}
