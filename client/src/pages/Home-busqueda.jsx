import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Home-busqueda.css';

const URL = 'http://localhost:8000/pokeapi/api/pokemon'

export default function HomeBusqueda() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const debounceSearch = useCallback((value) => {
        // Lógica para verificar si el valor esta vacio
        if (!value.trim()){ // Es el texto que ingresa el usuario y trim hace que se eliminen los espaicos en blanco.
            setSuggestions([]);
            return;
        }

        setLoading(true);
        setError('');

        axios.get(`${URL}/${value.toLowerCase()}/`).then((response) => {
            setSuggestions([response.data]);
        }).catch(() => {
            setSuggestions([]);
            setError('Pókemon no encontrado.');
        }).finally(() => {
            setLoading(false);
        })
    }, [])

    // Ejecutar debounce con delay
    useEffect(() => {
        const timer = setTimeout(() => {
        debounceSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceSearch]);

    const handleSelectPokemon = (pokemon) => {
        navigate(`/pokemon/${pokemon.name}`, { state: { pokemonData: pokemon } });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (suggestions.length > 0) {
        handleSelectPokemon(suggestions[0]);
        }
    };

        return (
        <div className="home-container">
        <div className="home-content">
            <h1 className="home-title">Pokédex</h1>
            <p className="home-subtitle">Busca información de tu Pokémon favorito</p>

            <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
                <input
                type="text"
                placeholder="Buscar Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                />
                <button type="submit" className="search-button">
                🔍
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                {suggestions.map((pokemon) => (
                    <div
                    key={pokemon.id}
                    className="suggestion-item"
                    onClick={() => handleSelectPokemon(pokemon)}
                    >
                    <img 
                        src={pokemon.image || "/placeholder.svg"} 
                        alt={pokemon.name} 
                        className="suggestion-image" 
                    />
                    <div className="suggestion-info">
                        <p className="suggestion-name">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </p>
                        <p className="suggestion-types">{pokemon.types.join(', ')}</p>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </form>

            <p className="home-hint">Prueba buscando: Pikachu, Charizard, Mewtwo...</p>
        </div>
        </div>
    );
}

export { HomeBusqueda };