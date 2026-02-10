package com.example.Eficha.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.dto.LoginResponse;
import com.example.Eficha.model.Paciente;
import com.example.Eficha.service.PacienteService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @PostMapping
    public Paciente cadastrar(@Valid @RequestBody Paciente paciente) {
        return service.salvar(paciente);
    }

    @GetMapping
    public List<Paciente> listar() {
        return service.listar();
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest login) {
        return service.login(login);
    }

    @GetMapping("/{id}")
    public Paciente buscarPorId(@PathVariable Long id) {
        Paciente p = service.buscarPorId(id);
        if (p == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado");
        }
        return p;
    }

    @PutMapping("/{id}")
    public Paciente atualizar(@PathVariable Long id, @RequestBody Paciente pacienteAtualizado) {
        return service.atualizar(id, pacienteAtualizado);
    }
}
