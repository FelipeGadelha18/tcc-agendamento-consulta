package com.example.Eficha.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.dto.LoginResponse;
import com.example.Eficha.exception.UnauthorizedException;
import com.example.Eficha.model.Recepcionista;
import com.example.Eficha.repository.RecepcionistaRepository;
import com.example.Eficha.util.CpfValidator;
import com.example.Eficha.util.JwtUtil;

@Service
public class RecepcionistaService {

    private final RecepcionistaRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public RecepcionistaService(RecepcionistaRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    public Recepcionista salvar(Recepcionista recepcionista) {
        if (!CpfValidator.isValidCpf(recepcionista.getCpf())) {
            throw new IllegalArgumentException("CPF inválido");
        }

        if (repository.findByCpf(recepcionista.getCpf()) != null) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        if (repository.findByEmail(recepcionista.getEmail()) != null) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        if (recepcionista.getIdPosto() == null) {
            throw new IllegalArgumentException("Recepcionista deve estar vinculado a um posto de saúde");
        }

        recepcionista.setSenha(encoder.encode(recepcionista.getSenha()));
        recepcionista.setAtivo(true);
        Recepcionista salvo = repository.save(recepcionista);
        salvo.setSenha(null);
        return salvo;
    }

    public List<Recepcionista> listar() {
        List<Recepcionista> lista = repository.findAll();
        lista.forEach(r -> r.setSenha(null));
        return lista;
    }

    public LoginResponse login(LoginRequest login) {
        if (!CpfValidator.isValidCpf(login.getCpf())) {
            throw new UnauthorizedException("CPF inválido");
        }

        Recepcionista recepcionista = repository.findByCpf(login.getCpf());

        if (recepcionista == null) {
            throw new UnauthorizedException("CPF ou senha incorretos");
        }

        if (!recepcionista.getAtivo()) {
            throw new UnauthorizedException("Recepcionista desativado");
        }

        boolean senhaCorreta = encoder.matches(login.getSenha(), recepcionista.getSenha());

        if (!senhaCorreta) {
            throw new UnauthorizedException("CPF ou senha incorretos");
        }

        String token = jwtUtil.generateToken(recepcionista.getId(), recepcionista.getCpf(), "RECEPCIONISTA",
                recepcionista.getIdPosto());

        LoginResponse response = new LoginResponse();
        response.setId(recepcionista.getId());
        response.setToken(token);
        response.setTipo("RECEPCIONISTA");
        response.setNome(recepcionista.getNomeCompleto());
        response.setCpf(recepcionista.getCpf());
        response.setIdPosto(recepcionista.getIdPosto());

        return response;
    }

    public Recepcionista buscarPorId(Long id) {
        return repository.findById(id).map(r -> {
            r.setSenha(null);
            return r;
        }).orElse(null);
    }

    public Recepcionista atualizar(Long id, Recepcionista recepcionista) {
        Recepcionista existente = repository.findById(id).orElse(null);

        if (existente == null) {
            return null;
        }

        if (recepcionista.getIdPosto() == null) {
            throw new IllegalArgumentException("Recepcionista deve estar vinculado a um posto de saúde");
        }

        existente.setNomeCompleto(recepcionista.getNomeCompleto());
        existente.setEmail(recepcionista.getEmail());
        existente.setIdPosto(recepcionista.getIdPosto());

        Recepcionista atualizado = repository.save(existente);
        atualizado.setSenha(null);
        return atualizado;
    }

    public boolean deletar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
