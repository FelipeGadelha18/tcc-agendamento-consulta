package com.example.Eficha.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.model.Paciente;
import com.example.Eficha.service.PacienteService;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    // CADASTRAR PACIENTE
    @PostMapping
    public Paciente cadastrar(@RequestBody Paciente paciente) {
        Paciente salvo = service.salvar(paciente);
        salvo.setSenha(null);
        return salvo;
    }

    // LISTAR PACIENTES
    @GetMapping
    public List<Paciente> listar() {
        return service.listar();
    }

    // LOGIN DO PACIENTE
    @PostMapping("/login")
    public Paciente login(@RequestBody LoginRequest login) {

        Paciente paciente = service.login(login);

        if (paciente == null) {
            // CPF não encontrado ou senha incorreta
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "CPF ou senha incorretos");
        }

        return paciente;
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public Paciente buscarPorId(@PathVariable Long id) {
        Paciente p = service.buscarPorId(id);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado");
        }
        return p;
    }
}
