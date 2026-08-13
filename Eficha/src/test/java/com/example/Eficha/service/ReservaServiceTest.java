package com.example.Eficha.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.Eficha.model.Paciente;
import com.example.Eficha.model.PostoSaude;
import com.example.Eficha.model.Reserva;
import com.example.Eficha.model.StatusReserva;
import com.example.Eficha.repository.PacienteRepository;
import com.example.Eficha.repository.PostoSaudeRepository;
import com.example.Eficha.repository.ReservaRepository;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private PostoSaudeRepository postoRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private ReservaService reservaService;

    @Test
    void deveIncluirIdDaReservaNoRetornoAoReservarFicha() {
        LocalDate dataReserva = LocalDate.now().plusDays(1);

        Paciente paciente = new Paciente();
        ReflectionTestUtils.setField(paciente, "id", 1L);
        paciente.setNomeCompleto("Maria Silva");
        paciente.setCpf("12345678900");

        PostoSaude posto = new PostoSaude();
        posto.setId(10L);
        posto.setNome("Posto Central");
        posto.setEndereco("Rua A");
        posto.setBairro("Centro");
        posto.setCidade("São Paulo");
        posto.setEstado("SP");
        posto.setTelefone("11999999999");
        posto.setFichasDisponiveis(3);
        posto.setLimiteFichasPorCpf(1);
        posto.setDatasDisponiveis(List.of(dataReserva));
        posto.setDatasBloqueadas(List.of());

        Reserva reserva = new Reserva();
        reserva.setId(42L);
        reserva.setDataReserva(dataReserva);
        reserva.setPaciente(paciente);
        reserva.setPostoSaude(posto);
        reserva.setStatus(StatusReserva.PENDENTE);

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(postoRepository.findById(10L)).thenReturn(Optional.of(posto));
        when(reservaRepository.existsByPacienteIdAndDataReservaAndStatusNot(1L, dataReserva, StatusReserva.CANCELADA))
                .thenReturn(false);
        when(reservaRepository.findByPacienteIdAndDataReservaAndStatusNot(1L, dataReserva, StatusReserva.CANCELADA))
                .thenReturn(List.of());
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);
        when(postoRepository.save(any(PostoSaude.class))).thenReturn(posto);
        when(reservaRepository.findByPostoSaudeAndDataReserva(eq(posto), eq(dataReserva))).thenReturn(List.of(reserva));

        Map<String, Object> resposta = reservaService.reservarFicha(1L, 10L, dataReserva);

        assertThat(resposta)
                .containsKey("reservaId")
                .containsEntry("reservaId", 42L);
    }

    @Test
    void devePermitirNovaReservaQuandoReservaAnteriorDoDiaEstiverCancelada() {
        LocalDate dataReserva = LocalDate.now().plusDays(1);

        Paciente paciente = new Paciente();
        ReflectionTestUtils.setField(paciente, "id", 1L);
        paciente.setNomeCompleto("Maria Silva");
        paciente.setCpf("12345678900");

        PostoSaude posto = new PostoSaude();
        posto.setId(10L);
        posto.setNome("Posto Central");
        posto.setEndereco("Rua A");
        posto.setBairro("Centro");
        posto.setCidade("São Paulo");
        posto.setEstado("SP");
        posto.setTelefone("11999999999");
        posto.setFichasDisponiveis(3);
        posto.setLimiteFichasPorCpf(1);
        posto.setDatasDisponiveis(List.of(dataReserva));
        posto.setDatasBloqueadas(List.of());

        Reserva reserva = new Reserva();
        reserva.setId(43L);
        reserva.setDataReserva(dataReserva);
        reserva.setPaciente(paciente);
        reserva.setPostoSaude(posto);
        reserva.setStatus(StatusReserva.PENDENTE);

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(postoRepository.findById(10L)).thenReturn(Optional.of(posto));
        when(reservaRepository.existsByPacienteIdAndDataReservaAndStatusNot(1L, dataReserva, StatusReserva.CANCELADA))
                .thenReturn(false);
        when(reservaRepository.findByPacienteIdAndDataReservaAndStatusNot(1L, dataReserva, StatusReserva.CANCELADA))
                .thenReturn(List.of());
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);
        when(postoRepository.save(any(PostoSaude.class))).thenReturn(posto);
        when(reservaRepository.findByPostoSaudeAndDataReserva(eq(posto), eq(dataReserva))).thenReturn(List.of(reserva));

        Map<String, Object> resposta = reservaService.reservarFicha(1L, 10L, dataReserva);

        assertThat(resposta).containsEntry("reservaId", 43L);
        verify(reservaRepository).existsByPacienteIdAndDataReservaAndStatusNot(1L, dataReserva,
                StatusReserva.CANCELADA);
        verify(reservaRepository).findByPacienteIdAndDataReservaAndStatusNot(1L, dataReserva,
                StatusReserva.CANCELADA);
    }
}
