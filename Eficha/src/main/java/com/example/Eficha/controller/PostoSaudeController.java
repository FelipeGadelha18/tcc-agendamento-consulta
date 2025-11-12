package com.example.Eficha.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.repository.*;

@RestController
@RequestMapping("/postos")
public class PostoSaudeController {

    @Autowired
    private PostoSaudeRepository postoRepository;

    @PostMapping("/cadastrar")
    public String cadastrarPosto(@RequestBody PostoSaude posto) {
        posto.setFichasDisponiveis(posto.getTotalFichas());
        postoRepository.save(posto);
        return "Posto cadastrado com sucesso!";
    }

    @GetMapping("/listar")
    public List<PostoSaude> listarPostos() {
        return postoRepository.findAll();
    }
}
