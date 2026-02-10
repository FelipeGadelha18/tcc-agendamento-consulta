package com.example.Eficha.service;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.dto.LoginResponse;
import com.example.Eficha.exception.UnauthorizedException;
import com.example.Eficha.model.Paciente;
import com.example.Eficha.repository.PacienteRepository;
import com.example.Eficha.util.CpfValidator;
import com.example.Eficha.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public PacienteService(PacienteRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    public Paciente salvar(Paciente paciente) {
        if (!CpfValidator.isValidCpf(paciente.getCpf())) {
            throw new IllegalArgumentException("CPF inválido");
        }

        if (paciente.getEmail() == null || !paciente.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }

        if (repository.findByCpf(paciente.getCpf()) != null) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        paciente.setSenha(encoder.encode(paciente.getSenha()));
        Paciente salvo = repository.save(paciente);
        salvo.setSenha(null);
        return salvo;
    }

    public List<Paciente> listar() {
        List<Paciente> lista = repository.findAll();
        lista.forEach(p -> p.setSenha(null));
        return lista;
    }

    public LoginResponse login(LoginRequest login) {
        if (!CpfValidator.isValidCpf(login.getCpf())) {
            throw new UnauthorizedException("CPF inválido");
        }

        Paciente paciente = repository.findByCpf(login.getCpf());

        if (paciente == null) {
            throw new UnauthorizedException("CPF ou senha incorretos");
        }

        boolean senhaCorreta = encoder.matches(login.getSenha(), paciente.getSenha());

        if (!senhaCorreta) {
            throw new UnauthorizedException("CPF ou senha incorretos");
        }

        String token = jwtUtil.generateToken(paciente.getId(), paciente.getCpf(), "PACIENTE");

        LoginResponse response = new LoginResponse();
        response.setId(paciente.getId());
        response.setToken(token);
        response.setTipo("PACIENTE");
        response.setNome(paciente.getNomeCompleto());
        response.setCpf(paciente.getCpf());

        return response;
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id).map(p -> {
            p.setSenha(null);
            return p;
        }).orElse(null);
    }

    public Paciente atualizar(Long id, Paciente pacienteAtualizado) {
        return repository.findById(id).map(paciente -> {
            paciente.setNomeCompleto(pacienteAtualizado.getNomeCompleto());
            paciente.setTelefone(pacienteAtualizado.getTelefone());
            paciente.setEmail(pacienteAtualizado.getEmail());
            paciente.setEndereco(pacienteAtualizado.getEndereco());
            paciente.setNumeroCasa(pacienteAtualizado.getNumeroCasa());
            paciente.setFoto(pacienteAtualizado.getFoto());
            
            Paciente atualizado = repository.save(paciente);
            atualizado.setSenha(null);
            return atualizado;
        }).orElse(null);
    }
}
