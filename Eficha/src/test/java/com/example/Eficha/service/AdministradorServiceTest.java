package com.example.Eficha.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Eficha.model.Administrador;
import com.example.Eficha.repository.AdministradorRepository;
import com.example.Eficha.util.JwtUtil;

@ExtendWith(MockitoExtension.class)
class AdministradorServiceTest {

    @Mock
    private AdministradorRepository repository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AdministradorService service;

    @BeforeEach
    void setUp() {
        when(repository.findByCpf(any())).thenReturn(null);
        when(repository.findByEmail(any())).thenReturn(null);
        when(repository.save(any(Administrador.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void deveCadastrarAdministradorSemVinculoComPosto() {
        Administrador administrador = new Administrador();
        administrador.setNomeCompleto("Admin Geral");
        administrador.setCpf("12345678900");
        administrador.setEmail("admin@teste.com");
        administrador.setSenha("senha123");
        administrador.setIdPosto(null);

        Administrador salvo = service.salvar(administrador);

        ArgumentCaptor<Administrador> captor = ArgumentCaptor.forClass(Administrador.class);
        verify(repository).save(captor.capture());

        assertEquals("ADM", captor.getValue().getPerfil());
        assertNotNull(salvo.getAtivo());
        assertTrue(salvo.getAtivo());
    }

    @Test
    void deveExigirPostoParaRecepcionista() {
        Administrador recepcionista = new Administrador();
        recepcionista.setNomeCompleto("Recepcionista");
        recepcionista.setCpf("98765432100");
        recepcionista.setEmail("recep@teste.com");
        recepcionista.setSenha("senha123");
        recepcionista.setIdPosto(null);
        recepcionista.setPerfil("RECEPCIONISTA");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> service.salvar(recepcionista));

        assertEquals("Recepcionista deve estar vinculado a um posto de saúde", exception.getMessage());
    }
}
