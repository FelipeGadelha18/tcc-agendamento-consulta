package com.example.Eficha.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;
import org.springframework.http.ResponseEntity;

import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.repository.PostoSaudeRepository;

@RestController
@RequestMapping("/postos")
@CrossOrigin(origins = "http://localhost:4200")
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

    // 🔹 listar datas disponíveis para um posto
    @GetMapping("/{id}/datas")
    public List<LocalDate> listarDatas(@PathVariable Long id) {
        return postoRepository.findById(id)
                .map(PostoSaude::getDatasDisponiveis)
                .orElse(List.of());
    }

    // DTO usado para receber data do front-end
    public static class DataDTO {
        public String data;
    }

    // 🔹 adicionar data disponível a um posto
    @PostMapping("/{id}/datas")
    public ResponseEntity<?> adicionarData(@PathVariable Long id, @RequestBody DataDTO dto) {
        var posto = postoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));
        LocalDate data;
        try {
            data = LocalDate.parse(dto.data);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Formato de data inválido");
        }
        if (posto.getDatasDisponiveis() == null) {
            posto.setDatasDisponiveis(new ArrayList<>());
        }
        if (!posto.getDatasDisponiveis().contains(data)) {
            posto.getDatasDisponiveis().add(data);
            postoRepository.save(posto);
        }
        return ResponseEntity.ok().build();
    }

    // 🔹 remover uma data disponível
    @DeleteMapping("/{id}/datas/{data}")
    public ResponseEntity<?> removerData(@PathVariable Long id, @PathVariable String data) {
        var posto = postoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Posto não encontrado"));
        if (posto.getDatasDisponiveis() != null) {
            try {
                LocalDate dt = LocalDate.parse(data);
                posto.getDatasDisponiveis().remove(dt);
                postoRepository.save(posto);
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Formato de data inválido");
            }
        }
        return ResponseEntity.ok().build();
    }
}
