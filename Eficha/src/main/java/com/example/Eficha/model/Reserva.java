package com.example.Eficha.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataReserva;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "posto_saude_id")
    private PostoSaude postoSaude;

    public Reserva() {
    }

    public Reserva(Long id, LocalDate dataReserva, Paciente paciente, PostoSaude postoSaude) {
        this.id = id;
        this.dataReserva = dataReserva;
        this.paciente = paciente;
        this.postoSaude = postoSaude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDataReserva() {
        return dataReserva;
    }

    public void setDataReserva(LocalDate dataReserva) {
        this.dataReserva = dataReserva;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public PostoSaude getPostoSaude() {
        return postoSaude;
    }

    public void setPostoSaude(PostoSaude postoSaude) {
        this.postoSaude = postoSaude;
    }
}
