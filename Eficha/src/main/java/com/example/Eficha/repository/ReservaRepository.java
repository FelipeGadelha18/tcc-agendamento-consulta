package com.example.Eficha.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Eficha.model.Reserva;
import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.model.StatusReserva;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Verifica se paciente já tem reserva no dia
    boolean existsByPacienteIdAndDataReserva(Long pacienteId, LocalDate dataReserva);

    // Lista reservas do paciente
    List<Reserva> findByPacienteId(Long pacienteId);

    // Buscar reserva pelo id e paciente (para cancelar com segurança)
    Optional<Reserva> findByIdAndPacienteId(Long reservaId, Long pacienteId);

    // Buscar reservas por posto + data
    List<Reserva> findByPostoSaudeAndDataReserva(PostoSaude postoSaude, LocalDate dataReserva);

    // Buscar reservas por posto id (paginado)
    Page<Reserva> findByPostoSaudeId(Long postoId, Pageable pageable);

    // Buscar por status (ex: CONFIRMADA)
    List<Reserva> findByStatus(StatusReserva status);
}
