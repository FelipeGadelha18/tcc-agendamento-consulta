package com.example.Eficha.service;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.model.Administrador;
import com.example.Eficha.repository.AdministradorRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministradorService {

    private final AdministradorRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AdministradorService(AdministradorRepository repository) {
        this.repository = repository;
    }

    // CADASTRO DO ADMINISTRADOR
    public Administrador salvar(Administrador administrador) {
        // Verifica se o CPF já existe
        if (repository.findByCpf(administrador.getCpf()) != null) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        // Verifica se o email já existe
        if (repository.findByEmail(administrador.getEmail()) != null) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        administrador.setSenha(encoder.encode(administrador.getSenha()));
        administrador.setAtivo(true);
        Administrador salvo = repository.save(administrador);
        salvo.setSenha(null); // nunca retorna senha
        return salvo;
    }

    // LISTAR TODOS
    public List<Administrador> listar() {
        List<Administrador> lista = repository.findAll();
        lista.forEach(a -> a.setSenha(null));
        return lista;
    }

    // LOGIN
    public Administrador login(LoginRequest login) {
        Administrador administrador = repository.findByCpf(login.getCpf());

        if (administrador == null) {
            return null; // CPF não encontrado
        }

        // Verifica se está ativo
        if (!administrador.getAtivo()) {
            return null; // Administrador desativado
        }

        boolean senhaCorreta = encoder.matches(login.getSenha(), administrador.getSenha());

        if (!senhaCorreta) {
            return null; // Senha errada
        }

        administrador.setSenha(null);
        return administrador;
    }

    // BUSCAR POR ID
    public Administrador buscarPorId(Long id) {
        return repository.findById(id).map(a -> {
            a.setSenha(null);
            return a;
        }).orElse(null);
    }

    // BUSCAR POR CPF
    public Administrador buscarPorCpf(String cpf) {
        Administrador administrador = repository.findByCpf(cpf);
        if (administrador != null) {
            administrador.setSenha(null);
        }
        return administrador;
    }

    // ATUALIZAR
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

    // DELETAR
    public boolean deletar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // BUSCAR POR ID DO POSTO
    public List<Administrador> buscarPorIdPosto(Long idPosto) {
        List<Administrador> lista = repository.findAll().stream()
                .filter(a -> a.getIdPosto().equals(idPosto))
                .toList();
        lista.forEach(a -> a.setSenha(null));
        return lista;
    }
}
