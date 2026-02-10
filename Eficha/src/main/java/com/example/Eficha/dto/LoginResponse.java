package com.example.Eficha.dto;

public class LoginResponse {
    private Long id;
    private String token;
    private String tipo;
    private String nome;
    private String cpf;
    private Long idPosto;

    public LoginResponse() {}

    public LoginResponse(Long id, String token, String tipo, String nome, String cpf) {
        this.id = id;
        this.token = token;
        this.tipo = tipo;
        this.nome = nome;
        this.cpf = cpf;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public Long getIdPosto() { return idPosto; }
    public void setIdPosto(Long idPosto) { this.idPosto = idPosto; }
}
