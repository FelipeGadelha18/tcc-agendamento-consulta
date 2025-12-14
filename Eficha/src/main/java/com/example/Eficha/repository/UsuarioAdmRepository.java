package com.example.Eficha.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Eficha.model.UsuarioAdm;

public interface UsuarioAdmRepository extends JpaRepository<UsuarioAdm, Long> {
      Optional<UsuarioAdm> findByEmail(String email);
}
