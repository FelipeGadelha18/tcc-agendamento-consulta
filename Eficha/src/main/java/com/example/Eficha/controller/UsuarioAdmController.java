package com.example.Eficha.controller;

import com.example.Eficha.model.UsuarioAdm;
import com.example.Eficha.repository.UsuarioAdmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/adm")
@CrossOrigin
public class UsuarioAdmController {

    @Autowired
    private UsuarioAdmRepository usuarioAdmRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioAdm dadosLogin) {

        Optional<UsuarioAdm> admOpt =
                usuarioAdmRepository.findByEmail(dadosLogin.getEmail());

        if (admOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Email não encontrado");
        }

        UsuarioAdm adm = admOpt.get();

        if (!adm.getSenha().equals(dadosLogin.getSenha())) {
            return ResponseEntity.status(401).body("Senha incorreta");
        }

        return ResponseEntity.ok(adm);
    }
}
