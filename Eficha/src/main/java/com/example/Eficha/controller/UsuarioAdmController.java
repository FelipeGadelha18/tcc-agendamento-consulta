package com.example.Eficha.controller;

import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.model.UsuarioAdm;
import com.example.Eficha.repository.PostoSaudeRepository;
import com.example.Eficha.repository.UsuarioAdmRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adm")
@CrossOrigin
public class UsuarioAdmController {

    @Autowired
    private UsuarioAdmRepository usuarioAdmRepository;

    @Autowired
    private PostoSaudeRepository postoSaudeRepository;

    @PostMapping("/cadastrar")
    public UsuarioAdm cadastrar(@RequestBody UsuarioAdm adm) {

        Long postoId = adm.getPosto().getId();

        PostoSaude posto = postoSaudeRepository.findById(postoId)
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));

        adm.setPosto(posto);

        return usuarioAdmRepository.save(adm);
    }
}
