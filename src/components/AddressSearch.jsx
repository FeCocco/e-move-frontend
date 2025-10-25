"use client";
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { forwardGeocode } from "@/utils/geocoding";
import { MapPin, Loader2, Search } from "lucide-react";

export function AddressSearch({ placeholder, onSelectLocation, value, onChange }) {
    const [inputValue, setInputValue] = useState(value || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const debounceTimer = useRef(null);
    const dropdownRef = useRef(null);
    const lastSearchRef = useRef(''); // Track last search to avoid duplicates

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Faz a pesquisa
    const performSearch = async (searchText) => {
        // Ignora duplicados
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
            setShowDropdown(true);
        } catch (err) {
            setError('Erro ao buscar endereço');
            setResults([]);
            setShowDropdown(false);
        } finally {
            setLoading(false);
        }
    };

    // Timeout de 1.5 segundos entre as pesquisas (Limite da API free)
    useEffect(() => {
        if (inputValue.trim().length < 3) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        // Limpa o timeout
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        // Define novo timeou
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

    // Pesquisa imediatamente com um ENter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // Limpa o timeout
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            // Faz a pesquisa
            performSearch(inputValue);
        }
    };

    const handleSelectResult = (location) => {
        setInputValue(location.address);
        setShowDropdown(false);
        if (onSelectLocation) {
            onSelectLocation(location);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                        <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
                Digite e aguarde ou pressione Enter para buscar
            </p>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto">
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
                                    {result.address}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
            )}

            {showDropdown && !loading && results.length === 0 && inputValue.length >= 3 && (
                <div className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg p-4">
                    <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
                </div>
            )}
        </div>
    );
}