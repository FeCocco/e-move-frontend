import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Converte string do banco (YYYY-MM-DD) para Date local visual
export function parseDataLocal(dataString) {
    if (!dataString) return null;
    if (Array.isArray(dataString)) {
        return new Date(dataString[0], dataString[1] - 1, dataString[2]);
    }
    const partes = dataString.split('-');
    return new Date(partes[0], partes[1] - 1, partes[2]);
}

export function formatarDataExibicao(dataString) {
    const data = parseDataLocal(dataString);
    if (!data) return "-";
    return data.toLocaleDateString('pt-BR');
}

// Usa o horário local, evitando o bug de fuso horário do toISOString
export function formatarDataParaAPI(date) {
    if (!date) return null;
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}