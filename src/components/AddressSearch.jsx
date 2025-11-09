"use client";
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { forwardGeocode } from "@/utils/geocoding";
import { MapPin, Loader2, Search } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

export function AddressSearch({ placeholder, onSelectLocation, value, onChange }) {
    const [inputValue, setInputValue] = useState(value || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const debounceTimer = useRef(null);
    const lastSearchRef = useRef('');
    const previousInputRef = useRef('');

    useEffect(() => {
        if (typeof value === 'string') {
            setInputValue(value);
        } else if (value && typeof value === 'object' && value.address) {
            setInputValue(value.address);
        } else {
            setInputValue('');
        }
    }, [value]);

    const performSearch = async (searchText) => {
        if (searchText.trim().length < 3) {
            setResults([]);
            setShowDropdown(false);
            lastSearchRef.current = '';
            return;
        }

        if (searchText === lastSearchRef.current) {
            // Se já temos resultados para esse texto, apenas mostra o dropdown
            if (results.length > 0) {
                setShowDropdown(true);
            }
            return;
        }

        setLoading(true);
        setError(null);
        lastSearchRef.current = searchText;

        try {
            const locations = await forwardGeocode(searchText);
            setResults(locations);
            setShowDropdown(true);
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
        const previousValue = previousInputRef.current;

        setInputValue(value);
        previousInputRef.current = value;

        // Se o input for limpo, reseta a última busca
        if (value.trim().length === 0) {
            lastSearchRef.current = '';
            setResults([]);
        }
        // Se o usuário apagou o texto e começou a digitar algo diferente
        else if (previousValue.length > 0 && value.length < previousValue.length) {
            // Usuário está apagando, reseta para permitir nova busca
            lastSearchRef.current = '';
        }

        if (onChange) onChange(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            // Só força uma nova busca se o texto atual for diferente da última busca
            // OU se o usuário apagou e digitou novamente (previousInputRef diferente)
            if (inputValue !== lastSearchRef.current) {
                lastSearchRef.current = '';
            }

            performSearch(inputValue);
        }
    };

    const handleSelectResult = (location) => {
        setInputValue(location.address);
        setShowDropdown(false);
        previousInputRef.current = location.address;
        if (onSelectLocation) {
            onSelectLocation(location);
        }
    };

    return (
        <Popover open={showDropdown} onOpenChange={setShowDropdown}>
            <div className="relative w-full">
                <PopoverAnchor asChild>
                    <div className="relative">
                        <Input
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
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

                <PopoverContent
                    className="z-50 w-[var(--radix-popover-anchor-width)] mt-2 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto p-0"
                    align="start"
                    side="bottom"
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