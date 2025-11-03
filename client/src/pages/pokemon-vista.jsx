import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import '../../css/Pokemon-vista.css';
import { set } from 'react-hook-form';
import { translateType } from '../../Traductor/translateTypes.jsx';
const URL = 'http://localhost:8000/pokeapi/api/pokemon'

export default function Pokemonvista() {
    const { name } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [pokemon, setPokemon] = useState(location.state?.pokemonData || null);
    const [selectedEvolution, setSelectedEvolution] = useState(null);
    const [loading, setLoading] = useState(!pokemon);
    const [error, setError] = useState('');

//Buscamos el pokemon si no lo tenemos
    useEffect(() => {
        if (!pokemon){
            setLoading(true);
            //Busca el pokemon por nombre al backend
            axios.get(`${URL}/${name.toLocaleLowerCase()}/`).then((reponse) => {
                setPokemon(reponse.data);
                setSelectedEvolution(response.data.name);
            }).catch(() => {
                setError('No se pudo cargar la información del Pokémon.');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setSelectedEvolution(pokemon.name);
        }
    }, [name, pokemon]);

//Buscamos la evolucion del pokemon
const handleEvolutionChange = (e) => {
    const evolutionName = e.target.value;
    setSelectedEvolution(evolutionName);
    setLoading(true);
    axios.get(`${URL}/${evolutionName.toLowerCase()}/`).then((response) => {
        setPokemon(response.data);
    }).catch(() => {
        setError('No se pudo cargar la información del Pokémon.');
    }).finally(() => {
        setLoading(false);
    });
};

if (loading) {
    return <div className="loading">Cargando....</div>
}

if(error || !pokemon){
    return (
        <div className = "error-container">
            <p>{error || 'Pokémon no encontrado'}</p>
            <button onClick={() => navigate('/')}>Volver al buscador</button>
        </div>
    )
}

const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};



    return (
        <div className="pokemon-container">
        {/* Sidebar */}
        <aside className="sidebar">
            <button className="back-button" onClick={() => navigate('/')}>
            ← Atrás
            </button>
        </aside>

        {/* Main Content */}
        <main className="pokemon-main">
            {/* Header con selector de evoluciones */}
            <div className="pokemon-header">
            <h1 className="pokemon-title">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>
            <select 
                value={selectedEvolution} 
                onChange={handleEvolutionChange} 
                className="evolution-selector"
            >
                {pokemon.evolutions.map((evo) => (
                <option key={evo} value={evo}>
                    {evo.charAt(0).toUpperCase() + evo.slice(1)}
                </option>
                ))}
            </select>
            </div>

            {/* Contenido principal */}
            <div className="pokemon-content">
            {/* Columna izquierda - Imagen y descripción */}
            <div className="pokemon-left">
                <img 
                src={pokemon.image || "/placeholder.svg"} 
                alt={pokemon.name} 
                className="pokemon-image" 
                />
                <p className="pokemon-description">
                {pokemon.description || 'Descripción no disponible para este Pokémon.'}
                </p>
            </div>

            {/* Columna derecha - Info detallada */}
            <div className="pokemon-right">
                {/* Tipos */}
                <div className="pokemon-section">
                <h3>Tipo</h3>
                <div className="types-container">
                    {pokemon.types.map((type) => (
                    <span
                        key={type}
                        className="type-badge"
                        style={{ backgroundColor: typeColors[type] || '#999' }}
                    >
                        {translateType(type)}
                    </span>
                    ))}
                </div>
                </div>

                {/* Debilidades */}
                <div className="weaknesses-section">
                <h3>Debilidades</h3>
                <div className="weakness-list">
                    {pokemon.weaknesses && pokemon.weaknesses.length > 0 ? (
                    pokemon.weaknesses.map((weakness) => (
                        <span
                        key={weakness}
                        className="weakness-badge"
                        style={{ backgroundColor: typeColors[weakness] || '#999' }}
                        >
                        {translateType(weakness)}
                        </span>
                    ))
                    ) : (
                    <p>Sin debilidades conocidas</p>
                    )}
                </div>
                </div>
            </div>
            </div>

            {/* Sección de Evoluciones */}
            <div className="evolutions-section">
            <h2>Evoluciones</h2>
            <div className="evolutions-container">
                {pokemon.evolutions.map((evo, index) => (
                <div key={evo} className="evolution-item">
                    <div className="evolution-circle">
                    <p className="evolution-name">
                        {evo.charAt(0).toUpperCase() + evo.slice(1)}
                    </p>
                    <button 
                        className="select-button" 
                        onClick={() => handleEvolutionChange({ target: { value: evo } })}
                    >
                        Seleccionar
                    </button>
                    </div>
                    {index < pokemon.evolutions.length - 1 && (
                    <div className="evolution-arrow">→</div>
                    )}
                </div>
                ))}
            </div>
            </div>
        </main>
        </div>
    );
}

export { Pokemonvista };