package com.example.Eficha.dto;

public class LoginRequest {
    private String cpf;
    private String senha;

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
