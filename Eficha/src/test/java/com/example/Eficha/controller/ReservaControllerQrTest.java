package com.example.Eficha.controller;

import com.example.Eficha.repository.PostoSaudeRepository;
import com.example.Eficha.repository.ReservaRepository;
import com.example.Eficha.service.ReservaPdfService;
import com.example.Eficha.service.ReservaService;
import com.example.Eficha.model.Reserva;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservaController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReservaControllerQrTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservaRepository reservaRepository;

    @MockBean
    private PostoSaudeRepository postoSaudeRepository;

    @MockBean
    private ReservaPdfService reservaPdfService;

    @MockBean
    private ReservaService reservaService;

    @Test
    void deveLocalizarReservaPorCodigoQr() throws Exception {
        Reserva reserva = new Reserva();
        reserva.setId(42L);

        when(reservaService.buscarReservaPorCodigo("reserva:42"))
                .thenReturn(reserva);

        mockMvc.perform(get("/reservas/qr/reserva:42"))
                .andExpect(status().isOk());
    }
}
