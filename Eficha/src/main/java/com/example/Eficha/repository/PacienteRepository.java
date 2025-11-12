package com.example.Eficha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Eficha.model.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

}
