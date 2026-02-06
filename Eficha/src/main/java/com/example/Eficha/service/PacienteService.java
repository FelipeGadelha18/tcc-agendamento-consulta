package com.example.Eficha.service;

import com.example.Eficha.dto.LoginRequest;
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

    // CADASTRO DO PACIENTE
    public Paciente salvar(Paciente paciente) {
        paciente.setSenha(encoder.encode(paciente.getSenha()));
        Paciente salvo = repository.save(paciente);
        salvo.setSenha(null); // nunca retorna senha
        return salvo;
    }

    // LISTAR TODOS
    public List<Paciente> listar() {
        List<Paciente> lista = repository.findAll();
        lista.forEach(p -> p.setSenha(null));
        return lista;
    }

    // LOGIN
    public Paciente login(LoginRequest login) {
        Paciente paciente = repository.findByCpf(login.getCpf());

        if (paciente == null) {
            return null; // CPF não encontrado
        }

        boolean senhaCorreta = encoder.matches(login.getSenha(), paciente.getSenha());

        if (!senhaCorreta) {
            return null; // Senha errada
        }

        paciente.setSenha(null);
        return paciente;
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id).map(p -> {
            p.setSenha(null);
            return p;
        }).orElse(null);
    }
}
