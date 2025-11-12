package com.example.Eficha.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String sobrenome;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(name = "numero_sus", nullable = false, unique = true, length = 15)
    private String numeroSUS;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 15)
    private String telefone;

    // senha armazenada como hash (BCrypt produz ~60 chars)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // permite apenas escrita via JSON (não é enviada nas respostas)
    @Column(nullable = false, length = 60)
    private String senha;

    public Paciente() {}

    public Paciente(String nome, String sobrenome, String cpf, String numeroSUS, String endereco, String email, String telefone, String senha) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.numeroSUS = numeroSUS;
        this.endereco = endereco;
        this.email = email;
        this.telefone = telefone;
        this.senha = senha;
    }

    // getters e setters (incluindo senha)
    public Long getId(){ 
        return id;
    }

    public String getNome(){ 
        return nome; 
    }
    public void setNome(String nome){ 
        this.nome = nome; 
    }

    public String getSobrenome(){ 
        return sobrenome; 
    }

    public void setSobrenome(String sobrenome){ 
        this.sobrenome = sobrenome; 
    }

    public String getCpf(){ 
        return cpf; 
    }

    public void setCpf(String cpf){ 
        this.cpf = cpf;
    }

    public String getNumeroSUS(){ 
        return numeroSUS; 
    }

    public void setNumeroSUS(String numeroSUS){ 
        this.numeroSUS = numeroSUS; 
    }

    public String getEndereco(){ 
        return endereco; 
    }

    public void setEndereco(String endereco){ 
        this.endereco = endereco; 
    }

    public String getEmail(){ 
        return email; 
    }

    public void setEmail(String email){ 
        this.email = email; 
    }

    public String getTelefone(){ 
        return telefone; 
    }

    public void setTelefone(String telefone){ 
        this.telefone = telefone; 
    }

    public String getSenha(){ 
        return senha; 
    }

    public void setSenha(String senha){ 
        this.senha = senha; 
    
    }
}
