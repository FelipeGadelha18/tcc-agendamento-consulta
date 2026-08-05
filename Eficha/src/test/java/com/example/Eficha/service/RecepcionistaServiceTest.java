package com.example.Eficha.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Eficha.model.Recepcionista;
import com.example.Eficha.repository.RecepcionistaRepository;
import com.example.Eficha.util.JwtUtil;

@ExtendWith(MockitoExtension.class)
class RecepcionistaServiceTest {

    @Mock
    private RecepcionistaRepository repository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private RecepcionistaService service;

    @BeforeEach
    void setUp() {
        when(repository.findByCpf(any())).thenReturn(null);
        when(repository.findByEmail(any())).thenReturn(null);
    }

    @Test
    void deveExigirPostoParaRecepcionista() {
        Recepcionista recepcionista = new Recepcionista();
        recepcionista.setNomeCompleto("Recepcionista");
        recepcionista.setCpf("98765432100");
        recepcionista.setEmail("recep@teste.com");
        recepcionista.setSenha("senha123");
        recepcionista.setIdPosto(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> service.salvar(recepcionista));

        assertEquals("Recepcionista deve estar vinculado a um posto de saúde", exception.getMessage());
    }
}
