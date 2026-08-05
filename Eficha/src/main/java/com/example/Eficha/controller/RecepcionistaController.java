package com.example.Eficha.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.Eficha.dto.LoginRequest;
import com.example.Eficha.dto.LoginResponse;
import com.example.Eficha.model.Recepcionista;
import com.example.Eficha.service.RecepcionistaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/recepcionistas")
public class RecepcionistaController {

    private final RecepcionistaService service;

    public RecepcionistaController(RecepcionistaService service) {
        this.service = service;
    }

    @PostMapping
    public Recepcionista cadastrar(@Valid @RequestBody Recepcionista recepcionista) {
        try {
            return service.salvar(recepcionista);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping
    public List<Recepcionista> listar() {
        return service.listar();
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest login) {
        return service.login(login);
    }

    @GetMapping("/{id}")
    public Recepcionista buscarPorId(@PathVariable Long id) {
        Recepcionista r = service.buscarPorId(id);
        if (r == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recepcionista não encontrado");
        }
        return r;
    }

    @PutMapping("/{id}")
    public Recepcionista atualizar(@PathVariable Long id, @RequestBody Recepcionista recepcionista) {
        try {
            Recepcionista atualizado = service.atualizar(id, recepcionista);
            if (atualizado == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recepcionista não encontrado");
            }
            return atualizado;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        boolean deletado = service.deletar(id);
        if (!deletado) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recepcionista não encontrado");
        }
    }
}
