package com.example.Eficha.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.repository.PostoSaudeRepository;

@Service
public class PostoSaudeService {
    private final PostoSaudeRepository repository;

    public PostoSaudeService(PostoSaudeRepository repository){
        this.repository = repository;
    }

    public PostoSaude Salvar(PostoSaude posto){
        return repository.save(posto);
    }

    public List<PostoSaude> listar(){
        return repository.findAll();
    }

}
