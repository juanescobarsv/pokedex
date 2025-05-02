import React, { useState, useEffect } from "react";
import {
  fetchPokemonList,
  fetchPokemonDetails,
  PokemonDetails,
  PokemonListItems,
} from "./Utils/api";
import "./App.css";

function App() {
  const [pokemonList, setPokemonList] = useState<PokemonListItems[]>([]);
  const [, setLoadingList] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null
  );

  const [inputValue, setInputValue] = useState<string>("1");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [searchNumber, setSearchNumber] = useState<number>(1);
  const [, setLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    const loadPokemonList = async () => {
      setLoadingList(true);
      setError(null);
      try {
        const data = await fetchPokemonList();
        setPokemonList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingList(false);
      }
    };

    loadPokemonList();
  }, []);

  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  useEffect(() => {
    if (searchNumber) {
      const loadPokemonDetails = async (id: number) => {
        setLoadingDetails(true);
        setError(null);
        try {
          const data = await fetchPokemonDetails(id);
          setPokemonDetails(data);
        } catch (err: any) {
          setError(err.message);
          setPokemonDetails(null);
        } finally {
          setLoadingDetails(false);
        }
      };

      loadPokemonDetails(searchNumber);
    }
  }, [searchNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const parsedNumber = parseInt(debouncedInputValue, 10);
    if (!isNaN(parsedNumber) && parsedNumber >= 1 && parsedNumber <= 1025) {
      setSearchNumber(parsedNumber);
    }
  }, [debouncedInputValue]);

  function capitalizeFirstLetter(str: string): string {
    if (!str) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  console.log("Rendering App");

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <p>Search by number: (1 to 1025!)</p>
      <input
        type={"number"}
        value={inputValue}
        onChange={handleInputChange}
      ></input>
      {pokemonDetails && (
        <div className="main-container">
          <div className="singlePoke">
            <h2>{capitalizeFirstLetter(pokemonDetails.name)}</h2>
            <h2>#{pokemonDetails.id}</h2>
            <img
              src={
                pokemonDetails.sprites.other.home.front_default ||
                pokemonDetails.sprites.front_default
              }
              alt={pokemonDetails.name || "Pokémon image"}
            ></img>
          </div>
          <div className="poke-details">
            <h3>Types:</h3>
            <ul>
              {pokemonDetails.types.map((typeEntry) => (
                <li key={typeEntry.slot}>
                  {capitalizeFirstLetter(typeEntry.type.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* LIST */}
      <h2>Full List of Pokémon:</h2>
      <ol>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.name}>{capitalizeFirstLetter(pokemon.name)}</li>
        ))}
      </ol>
    </div>
  );
}

export default App;
