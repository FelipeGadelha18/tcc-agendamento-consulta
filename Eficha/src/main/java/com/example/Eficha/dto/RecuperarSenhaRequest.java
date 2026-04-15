package com.example.Eficha.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RecuperarSenhaRequest {
    
    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 14, message = "CPF deve ter 11 dígitos")
    private String cpf;

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String novaSenha;

    public String getCpf() { 
        return cpf; 
    }

    public void setCpf(String cpf) { 
        this.cpf = cpf; 
    }

    public String getNovaSenha() { 
        return novaSenha; 
    }

    public void setNovaSenha(String novaSenha) { 
        this.novaSenha = novaSenha; 
    }
}
