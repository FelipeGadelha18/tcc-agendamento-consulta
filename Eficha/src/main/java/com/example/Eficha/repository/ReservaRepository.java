package com.example.Eficha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Eficha.model.Reserva;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    boolean existsByPacienteIdAndDataReserva(Long pacienteId, LocalDate dataReserva);

    List<Reserva> findByPacienteId(Long pacienteId);
}
