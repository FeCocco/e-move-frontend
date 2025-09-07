// src/lib/errorHandler.jsx

/**
 * Processa uma string de erro vinda da API e retorna uma mensagem amigável.
 * @param {string} errorString - A string de erro, que pode ser texto simples ou um JSON.
 * @returns {string} - A mensagem de erro formatada para o usuário.
 */
export const getApiErrorMessage = (errorString) => {
    if (!errorString) {
        return "Ocorreu um erro desconhecido.";
    }

    try {
        const errorJson = JSON.parse(errorString);

        // NOVO: Trata especificamente o erro "Bad Request" do backend
        if (errorJson.status === 400 && errorJson.error === "Bad Request") {
            // Se o backend enviar uma mensagem específica, use-a.
            // Senão, use uma mensagem genérica amigável.
            return errorJson.message || "Os dados enviados são inválidos. Verifique os campos e tente novamente.";
        }

        // Mantém a verificação para outros erros de servidor
        if (errorJson.status && errorJson.error) {
            return "Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.";
        }
    } catch (e) {
        // Se não for JSON, provavelmente é uma mensagem de erro customizada do backend.
        // Ex: "E-mail já cadastrado"
        return errorString;
    }

    // Caso o JSON não tenha um formato esperado
    return "Ocorreu um erro desconhecido.";
};