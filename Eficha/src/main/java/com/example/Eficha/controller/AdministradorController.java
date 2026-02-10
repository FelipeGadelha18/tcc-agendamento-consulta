package com.example.Eficha.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.dto.LoginResponse;
import com.example.Eficha.model.Administrador;
import com.example.Eficha.service.AdministradorService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/administradores")
@CrossOrigin(origins = "*")
public class AdministradorController {

    private final AdministradorService service;

    public AdministradorController(AdministradorService service) {
        this.service = service;
    }

    @PostMapping
    public Administrador cadastrar(@Valid @RequestBody Administrador administrador) {
        try {
            return service.salvar(administrador);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping
    public List<Administrador> listar() {
        return service.listar();
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest login) {
        return service.login(login);
    }

    @GetMapping("/{id}")
    public Administrador buscarPorId(@PathVariable Long id) {
        Administrador a = service.buscarPorId(id);
        if (a == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
        return a;
    }

    @GetMapping("/cpf/{cpf}")
    public Administrador buscarPorCpf(@PathVariable String cpf) {
        Administrador a = service.buscarPorCpf(cpf);
        if (a == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
        return a;
    }

    @PutMapping("/{id}")
    public Administrador atualizar(@PathVariable Long id, @RequestBody Administrador administrador) {
        Administrador atualizado = service.atualizar(id, administrador);
        if (atualizado == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
        return atualizado;
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        boolean deletado = service.deletar(id);
        if (!deletado) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
    }

    @GetMapping("/posto/{idPosto}")
    public List<Administrador> buscarPorIdPosto(@PathVariable Long idPosto) {
        return service.buscarPorIdPosto(idPosto);
    }
}
