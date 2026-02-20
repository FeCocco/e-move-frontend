export const dicionario = {
    "pt-BR": {
        "abaEstacoes": {
            "free": "Gratuito",
            "membership required": "Requer assinatura",
            "charged successfully": "Recarga efetuada com sucesso",
            "equipment & location confirmed correct": "Localização e equipamento confirmados",
        },
        "geral": {

        }
    },
    "en-US": {
        "custos": {
        },
        "geral": {
        }
    },
};

export function traduzirAbaEstacoes(valorOriginal, idioma = "pt-BR") {
    if (!valorOriginal) return null;

    // pega a string original da API, convertemos para minúsculo e tiramos os espaços extras
    const chaveBusca = valorOriginal.toLowerCase().trim();

    // busca no JSON. Se não achar a palavra exata, ele devolve o texto original em i para não quebrar a tela
    return dicionario[idioma].abaEstacoes[chaveBusca] || valorOriginal;
}

export function traduzirGeral(chave, idioma = "pt-BR") {
    return dicionario[idioma].abaEstacoes[chave] || chave;
}