package com.example.Eficha.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posto_saude")
public class PostoSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;
    private String bairro;
    private String cidade;
    private String estado;
    private String telefone;
    private int totalFichas;
    private int fichasDisponiveis;
    private int limiteFichasPorCpf = 1;
    private int prazoCancelamentoHoras = 24;

    @ElementCollection
    @CollectionTable(name = "posto_datas_disponiveis", joinColumns = @JoinColumn(name = "posto_id"))
    @Column(name = "data_disponivel")
    private List<LocalDate> datasDisponiveis = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "posto_datas_bloqueadas", joinColumns = @JoinColumn(name = "posto_id"))
    @Column(name = "data_bloqueada")
    private List<LocalDate> datasBloqueadas = new ArrayList<>();

    public PostoSaude() {
    }

    public PostoSaude(Long id, String nome, String endereco, String bairro, String cidade, String estado,
            String telefone, int totalFichas, int fichasDisponiveis) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.telefone = telefone;
        this.totalFichas = totalFichas;
        this.fichasDisponiveis = fichasDisponiveis;
    }

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

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public int getTotalFichas() {
        return totalFichas;
    }

    public void setTotalFichas(int totalFichas) {
        this.totalFichas = totalFichas;
    }

    public int getFichasDisponiveis() {
        return fichasDisponiveis;
    }

    public void setFichasDisponiveis(int fichasDisponiveis) {
        this.fichasDisponiveis = fichasDisponiveis;
    }

    public int getLimiteFichasPorCpf() {
        return limiteFichasPorCpf;
    }

    public void setLimiteFichasPorCpf(int limiteFichasPorCpf) {
        this.limiteFichasPorCpf = limiteFichasPorCpf;
    }

    public int getPrazoCancelamentoHoras() {
        return prazoCancelamentoHoras;
    }

    public void setPrazoCancelamentoHoras(int prazoCancelamentoHoras) {
        this.prazoCancelamentoHoras = prazoCancelamentoHoras;
    }

    public List<LocalDate> getDatasDisponiveis() {
        return datasDisponiveis;
    }

    public void setDatasDisponiveis(List<LocalDate> datasDisponiveis) {
        this.datasDisponiveis = datasDisponiveis;
    }

    public List<LocalDate> getDatasBloqueadas() {
        return datasBloqueadas;
    }

    public void setDatasBloqueadas(List<LocalDate> datasBloqueadas) {
        this.datasBloqueadas = datasBloqueadas;
    }

    @PrePersist
    @PreUpdate
    private void ajustarLimiteFichasPorCpf() {
        if (this.limiteFichasPorCpf <= 0) {
            this.limiteFichasPorCpf = 1;
        }
        if (this.prazoCancelamentoHoras <= 0) {
            this.prazoCancelamentoHoras = 24;
        }
    }
}
