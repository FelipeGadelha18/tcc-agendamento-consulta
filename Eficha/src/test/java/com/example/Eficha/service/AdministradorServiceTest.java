package com.example.Eficha.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
    void deveCadastrarAdministrador() {
        Administrador administrador = new Administrador();
        administrador.setNomeCompleto("Admin Geral");
        administrador.setCpf("11144477735");
        administrador.setEmail("admin@teste.com");
        administrador.setSenha("senha123");

        Administrador salvo = service.salvar(administrador);

        assertNotNull(salvo.getAtivo());
        assertTrue(salvo.getAtivo());
    }
}
