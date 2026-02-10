package com.example.Eficha.service;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.dto.LoginResponse;
import com.example.Eficha.exception.UnauthorizedException;
import com.example.Eficha.model.Administrador;
import com.example.Eficha.repository.AdministradorRepository;
import com.example.Eficha.util.CpfValidator;
import com.example.Eficha.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministradorService {

    private final AdministradorRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public AdministradorService(AdministradorRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    public Administrador salvar(Administrador administrador) {
        if (!CpfValidator.isValidCpf(administrador.getCpf())) {
            throw new IllegalArgumentException("CPF inválido");
        }

        if (repository.findByCpf(administrador.getCpf()) != null) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        if (repository.findByEmail(administrador.getEmail()) != null) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        administrador.setSenha(encoder.encode(administrador.getSenha()));
        administrador.setAtivo(true);
        Administrador salvo = repository.save(administrador);
        salvo.setSenha(null);
        return salvo;
    }

    public List<Administrador> listar() {
        List<Administrador> lista = repository.findAll();
        lista.forEach(a -> a.setSenha(null));
        return lista;
    }

    public LoginResponse login(LoginRequest login) {
        if (!CpfValidator.isValidCpf(login.getCpf())) {
            throw new UnauthorizedException("CPF inválido");
        }

        Administrador administrador = repository.findByCpf(login.getCpf());

        if (administrador == null) {
            throw new UnauthorizedException("CPF ou senha incorretos");
        }

        if (!administrador.getAtivo()) {
            throw new UnauthorizedException("Administrador desativado");
        }

        boolean senhaCorreta = encoder.matches(login.getSenha(), administrador.getSenha());

        if (!senhaCorreta) {
            throw new UnauthorizedException("CPF ou senha incorretos");
        }

        String token = jwtUtil.generateToken(administrador.getId(), administrador.getCpf(), "ADM");

        LoginResponse response = new LoginResponse();
        response.setId(administrador.getId());
        response.setToken(token);
        response.setTipo("ADM");
        response.setNome(administrador.getNomeCompleto());
        response.setCpf(administrador.getCpf());
        response.setIdPosto(administrador.getIdPosto());

        return response;
    }

    public Administrador buscarPorId(Long id) {
        return repository.findById(id).map(a -> {
            a.setSenha(null);
            return a;
        }).orElse(null);
    }

    public Administrador buscarPorCpf(String cpf) {
        Administrador administrador = repository.findByCpf(cpf);
        if (administrador != null) {
            administrador.setSenha(null);
        }
        return administrador;
    }

    public Administrador atualizar(Long id, Administrador administrador) {
        Administrador existente = repository.findById(id).orElse(null);

        if (existente == null) {
            return null;
        }

        existente.setNomeCompleto(administrador.getNomeCompleto());
        existente.setEmail(administrador.getEmail());
        existente.setIdPosto(administrador.getIdPosto());

        Administrador atualizado = repository.save(existente);
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

    public List<Administrador> buscarPorIdPosto(Long idPosto) {
        List<Administrador> lista = repository.findAll().stream()
                .filter(a -> a.getIdPosto().equals(idPosto))
                .toList();
        lista.forEach(a -> a.setSenha(null));
        return lista;
    }
}
