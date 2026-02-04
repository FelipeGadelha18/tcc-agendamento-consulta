package com.example.Eficha.service;

import com.example.Eficha.model.Reserva;
import com.example.Eficha.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ReservaPdfService {

    @Autowired
    private ReservaRepository reservaRepository;

    public byte[] gerarComprovante(Long reservaId) {

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);

            document.open();

            // 🔵 CORES DO SISTEMA
            Color azulPrincipal = new Color(25, 118, 210);
            Color cinza = new Color(90, 90, 90);

            // 🔠 FONTES
            Font tituloFont = new Font(Font.HELVETICA, 20, Font.BOLD, azulPrincipal);
            Font subtituloFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font textoFont = new Font(Font.HELVETICA, 12);
            Font rodapeFont = new Font(Font.HELVETICA, 9, Font.ITALIC, cinza);

            // 🔷 CABEÇALHO
            Paragraph titulo = new Paragraph("COMPROVANTE DE AGENDAMENTO", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);

            document.add(new Paragraph(" "));
            document.add(new LineSeparator());

            document.add(new Paragraph(" "));

            // 📄 DADOS DA RESERVA
            PdfPTable tabela = new PdfPTable(2);
            tabela.setWidthPercentage(100);
            tabela.setSpacingBefore(10f);
            tabela.setSpacingAfter(10f);
            tabela.setWidths(new float[]{30f, 70f});

            adicionarLinha(tabela, "Paciente:", reserva.getPaciente().getNomeCompleto(), subtituloFont, textoFont);
            adicionarLinha(tabela, "CPF:", reserva.getPaciente().getCpf(), subtituloFont, textoFont);
            adicionarLinha(tabela, "Posto de Saúde:", reserva.getPostoSaude().getNome(), subtituloFont, textoFont);
            adicionarLinha(tabela, "Endereço:",
                    reserva.getPostoSaude().getEndereco() + " - " + reserva.getPostoSaude().getBairro(),
                    subtituloFont, textoFont);

            String dataFormatada = reserva.getDataReserva()
                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            adicionarLinha(tabela, "Data da Consulta:", dataFormatada, subtituloFont, textoFont);
            adicionarLinha(tabela, "Status:", "CONFIRMADA", subtituloFont, textoFont);

            document.add(tabela);

            // 🟦 DESTAQUE
            Paragraph destaque = new Paragraph(
                    "⚠️ Apresente este comprovante no posto no dia da consulta.",
                    new Font(Font.HELVETICA, 12, Font.BOLD, azulPrincipal)
            );
            destaque.setAlignment(Element.ALIGN_CENTER);
            document.add(destaque);

            document.add(new Paragraph(" "));
            document.add(new LineSeparator());

            // 📌 RODAPÉ
            Paragraph rodape = new Paragraph(
                    "Sistema e-Ficha • Documento gerado automaticamente",
                    rodapeFont
            );
            rodape.setAlignment(Element.ALIGN_CENTER);
            document.add(rodape);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }

    private void adicionarLinha(
            PdfPTable tabela,
            String titulo,
            String valor,
            Font tituloFont,
            Font valorFont
    ) {
        PdfPCell cellTitulo = new PdfPCell(new Phrase(titulo, tituloFont));
        cellTitulo.setBorder(Rectangle.NO_BORDER);
        cellTitulo.setPadding(6);

        PdfPCell cellValor = new PdfPCell(new Phrase(valor, valorFont));
        cellValor.setBorder(Rectangle.NO_BORDER);
        cellValor.setPadding(6);

        tabela.addCell(cellTitulo);
        tabela.addCell(cellValor);
    }
}
