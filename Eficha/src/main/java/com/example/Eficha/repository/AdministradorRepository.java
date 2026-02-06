package com.example.Eficha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Eficha.model.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Administrador findByCpf(String cpf);
    Administrador findByEmail(String email);
}
