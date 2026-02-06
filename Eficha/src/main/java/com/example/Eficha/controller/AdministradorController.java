package com.example.Eficha.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.model.Administrador;
import com.example.Eficha.service.AdministradorService;

import java.util.List;

@RestController
@RequestMapping("/administradores")
@CrossOrigin(origins = "*")
public class AdministradorController {

    private final AdministradorService service;

    public AdministradorController(AdministradorService service) {
        this.service = service;
    }

    // CADASTRAR ADMINISTRADOR
    @PostMapping
    public Administrador cadastrar(@RequestBody Administrador administrador) {
        try {
            Administrador salvo = service.salvar(administrador);
            return salvo;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // LISTAR ADMINISTRADORES
    @GetMapping
    public List<Administrador> listar() {
        return service.listar();
    }

    // LOGIN DO ADMINISTRADOR
    @PostMapping("/login")
    public Administrador login(@RequestBody LoginRequest login) {
        Administrador administrador = service.login(login);

        if (administrador == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "CPF ou senha incorretos");
        }

        return administrador;
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public Administrador buscarPorId(@PathVariable Long id) {
        Administrador a = service.buscarPorId(id);
        if (a == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
        return a;
    }

    // BUSCAR POR CPF
    @GetMapping("/cpf/{cpf}")
    public Administrador buscarPorCpf(@PathVariable String cpf) {
        Administrador a = service.buscarPorCpf(cpf);
        if (a == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
        return a;
    }

    // ATUALIZAR
    @PutMapping("/{id}")
    public Administrador atualizar(@PathVariable Long id, @RequestBody Administrador administrador) {
        Administrador atualizado = service.atualizar(id, administrador);
        if (atualizado == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
        return atualizado;
    }

    // DELETAR
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        boolean deletado = service.deletar(id);
        if (!deletado) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado");
        }
    }

    // BUSCAR POR ID DO POSTO
    @GetMapping("/posto/{idPosto}")
    public List<Administrador> buscarPorIdPosto(@PathVariable Long idPosto) {
        return service.buscarPorIdPosto(idPosto);
    }
}
