package com.example.Eficha.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario_adm")
public class UsuarioAdm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;

    @ManyToOne
    @JoinColumn(name = "posto_id", nullable = false)
    private PostoSaude posto;

    // 🔹 GETTERS E SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public PostoSaude getPosto() {
        return posto;
    }

    public void setPosto(PostoSaude posto) {
        this.posto = posto;
    }
}
