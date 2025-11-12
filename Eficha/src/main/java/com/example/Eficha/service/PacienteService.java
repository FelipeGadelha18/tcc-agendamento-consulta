package com.example.Eficha.service;

import org.springframework.stereotype.Service;
import com.example.Eficha.model.Paciente;
import com.example.Eficha.repository.PacienteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository repository;
    private final PasswordEncoder passwordEncoder;

    public PacienteService(PacienteRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Paciente salvar(Paciente paciente) {
        // se a senha vier não nula, codifica antes de salvar
        if (paciente.getSenha() != null && !paciente.getSenha().isBlank()) {
            String hashed = passwordEncoder.encode(paciente.getSenha());
            paciente.setSenha(hashed);
        }
        return repository.save(paciente);
    }

    public List<Paciente> listar() {
        return repository.findAll();
    }
}
