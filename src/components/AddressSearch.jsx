// src/components/AddressSearch.jsx

"use client";
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { forwardGeocode } from "@/utils/geocoding";
import { MapPin, Loader2, Search } from "lucide-react";
// NOVAS IMPORTAÇÕES
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

export function AddressSearch({ placeholder, onSelectLocation, value, onChange }) {
    const [inputValue, setInputValue] = useState(value || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const debounceTimer = useRef(null);
    const lastSearchRef = useRef('');

    // O useEffect que verificava cliques fora (handleClickOutside) não é mais necessário,
    // o Popover cuida disso automaticamente.

    // ... (toda a lógica: performSearch, useEffect[inputValue], handleInputChange, handleKeyDown) ...
    // ... (permanece idêntica) ...

    const performSearch = async (searchText) => {
        if (searchText === lastSearchRef.current) {
            return;
        }

        if (searchText.trim().length < 3) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        setError(null);
        lastSearchRef.current = searchText;

        try {
            const locations = await forwardGeocode(searchText);
            setResults(locations);
            setShowDropdown(true); // O Popover vai abrir
        } catch (err) {
            setError('Erro ao buscar endereço');
            setResults([]);
            setShowDropdown(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inputValue.trim().length < 3) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            performSearch(inputValue);
        }, 1500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [inputValue]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (onChange) onChange(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            performSearch(inputValue);
        }
    };

    const handleSelectResult = (location) => {
        setInputValue(location.address);
        setShowDropdown(false); // O Popover vai fechar
        if (onSelectLocation) {
            onSelectLocation(location);
        }
    };

    return (
        // Envolvemos tudo no Popover
        <Popover open={showDropdown} onOpenChange={setShowDropdown}>
            <div className="relative w-full">
                {/* PopoverAnchor define a referência de posição */}
                <PopoverAnchor asChild>
                    <div className="relative">
                        <Input
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
                            // Reabre o popover se clicar no input
                            onClick={() => (results.length > 0) && setShowDropdown(true)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                                <Search className="h-4 w-4 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                </PopoverAnchor>

                <p className="text-xs text-muted-foreground mt-1">
                    Digite e aguarde ou pressione Enter para buscar
                </p>

                {/* PopoverContent é renderizado em um Portal, fora do AppCard */}
                <PopoverContent
                    // Faz o Popover ter a mesma largura do Input
                    className="z-50 w-[var(--radix-popover-anchor-width)] mt-2 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto p-0"
                    align="start"
                    side="bottom"
                    // Impede o popover de "roubar" o foco do input ao abrir
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    {results.length > 0 && (
                        <>
                            {results.map((result, index) => (
                                <button
                                    key={index}
                                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-b-0"
                                    onClick={() => handleSelectResult(result)}
                                >
                                    <MapPin className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {result.address.split(',')[0]}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {result.displayName}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}

                    {error && (
                        <p className="text-xs text-destructive p-4">{error}</p>
                    )}

                    {showDropdown && !loading && results.length === 0 && inputValue.length >= 3 && (
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
                        </div>
                    )}
                </PopoverContent>
            </div>
        </Popover>
    );
}