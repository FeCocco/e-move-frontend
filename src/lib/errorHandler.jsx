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
        if (errorJson.status && errorJson.error) {
            return "Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.";
        }
    } catch (e) {
        // Erros definidos no backend
        return errorString;
    }

    // Caso o JSON não tenha o formato esperado
    return "Ocorreu um erro desconhecido.";
};