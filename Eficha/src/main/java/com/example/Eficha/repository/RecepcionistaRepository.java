package com.example.Eficha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Eficha.model.Recepcionista;

public interface RecepcionistaRepository extends JpaRepository<Recepcionista, Long> {
    Recepcionista findByCpf(String cpf);

    Recepcionista findByEmail(String email);
}
