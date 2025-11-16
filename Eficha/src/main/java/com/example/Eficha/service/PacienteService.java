package com.example.Eficha.service;

import com.example.Eficha.model.Paciente;
import com.example.Eficha.repository.PacienteRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public PacienteService(PacienteRepository repository) {
        this.repository = repository;
    }

    public Paciente salvar(Paciente paciente) {
        paciente.setSenha(encoder.encode(paciente.getSenha()));
        return repository.save(paciente);
    }

    public List<Paciente> listar() {
        return repository.findAll();
    }
}
