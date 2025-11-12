package com.example.Eficha.controller;

import org.springframework.web.bind.annotation.*;
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

    @PostMapping
    public Paciente cadastrar(@RequestBody Paciente paciente) {
    Paciente salvo = service.salvar(paciente);
    salvo.setSenha(null);
    return salvo;
}

    @GetMapping
    public List<Paciente> listar() {
        return service.listar();
    }
}
