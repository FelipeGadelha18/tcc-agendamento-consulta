package com.example.Eficha.util;

public class CpfValidator {

    public static boolean isValidCpf(String cpf) {
        if (cpf == null || cpf.isEmpty()) {
            return false;
        }

        cpf = cpf.replaceAll("[^0-9]", "");

        if (cpf.length() != 11) {
            return false;
        }

        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        int soma = 0;
        int multiplicador = 10;

        for (int i = 0; i < 9; i++) {
            soma += Integer.parseInt(String.valueOf(cpf.charAt(i))) * multiplicador;
            multiplicador--;
        }

        int primeiroDigito = 11 - (soma % 11);
        if (primeiroDigito >= 10) {
            primeiroDigito = 0;
        }

        soma = 0;
        multiplicador = 11;

        for (int i = 0; i < 10; i++) {
            soma += Integer.parseInt(String.valueOf(cpf.charAt(i))) * multiplicador;
            multiplicador--;
        }

        int segundoDigito = 11 - (soma % 11);
        if (segundoDigito >= 10) {
            segundoDigito = 0;
        }

        return primeiroDigito == Integer.parseInt(String.valueOf(cpf.charAt(9))) &&
               segundoDigito == Integer.parseInt(String.valueOf(cpf.charAt(10)));
    }
}
