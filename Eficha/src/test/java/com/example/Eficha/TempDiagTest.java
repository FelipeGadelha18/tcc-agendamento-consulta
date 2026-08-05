package com.example.Eficha;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.Eficha.model.Administrador;
import com.example.Eficha.repository.AdministradorRepository;
import com.example.Eficha.util.JwtUtil;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@SpringBootTest
class TempDiagTest {

    @Autowired
    private AdministradorRepository repository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private javax.sql.DataSource dataSource;

    @Test
    void inspecionarColunas() throws Exception {
        try (var conn = dataSource.getConnection(); var stmt = conn.createStatement()) {
            for (String tabela : new String[] { "administrador", "recepcionista", "posto_saude" }) {
                System.out.println("=== " + tabela + " ===");
                var rs = stmt.executeQuery("SHOW COLUMNS FROM " + tabela);
                while (rs.next()) {
                    System.out.println("COL " + tabela + " -> " + rs.getString("Field") + " | " + rs.getString("Type")
                            + " | NULL=" + rs.getString("Null") + " | Default=" + rs.getString("Default"));
                }
            }
        }
    }

    @Test
    void testarCadastros() throws Exception {
        Administrador primeiro = repository.findAll().stream().findFirst().orElse(null);
        if (primeiro == null) {
            System.out.println("NENHUM_ADMIN_ENCONTRADO");
            return;
        }
        String token = jwtUtil.generateToken(primeiro.getId(), primeiro.getCpf(), "ADM");
        System.out.println("TOKEN_GERADO=" + token);

        HttpClient client = HttpClient.newHttpClient();

        String postoBody = "{\"nome\":\"Posto Diagnostico2\",\"endereco\":\"Rua Diagnostico, 2\",\"bairro\":\"Bairro\",\"cidade\":\"Cidade\",\"estado\":\"AC\",\"telefone\":\"123456789\",\"totalFichas\":10,\"fichasDisponiveis\":10}";
        HttpRequest postoReq = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/postos/cadastrar"))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(postoBody))
                .build();
        HttpResponse<String> postoResp = client.send(postoReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("POSTO_STATUS=" + postoResp.statusCode());
        System.out.println("POSTO_BODY=" + postoResp.body());

        String recepBody = "{\"nomeCompleto\":\"Recepcionista Diagnostico2\",\"cpf\":\"11144477735\",\"email\":\"recep.diagnostico2@teste.com\",\"senha\":\"senha123\",\"idPosto\":1}";
        HttpRequest recepReq = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/recepcionistas"))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(recepBody))
                .build();
        HttpResponse<String> recepResp = client.send(recepReq, HttpResponse.BodyHandlers.ofString());
        System.out.println("RECEP_STATUS=" + recepResp.statusCode());
        System.out.println("RECEP_BODY=" + recepResp.body());
    }
}
