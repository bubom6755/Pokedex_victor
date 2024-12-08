import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Button, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import PokemonPreviewCard from "./components/PokemonPreviewCard";
import PokemonDetailPage from "./components/PokemonDetailPage";
import pokemonList from "./data/pokemon.json";
import pokeTypeColors from "./data/pokeTypeColors";

function App() {
  const pokemonsPerPage = 33;
  const savedLanguage = localStorage.getItem("language") || "english";
  const savedSearchQuery = localStorage.getItem("searchQuery") || "";

  const [language, setLanguage] = useState(savedLanguage);
  const [searchQuery, setSearchQuery] = useState(savedSearchQuery);
  const [filteredPokemons, setFilteredPokemons] = useState(pokemonList);
  const [selectedType, setSelectedType] = useState([]); // Initialisé comme tableau vide

  // Sauvegarde la langue et la requête de recherche
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("searchQuery", searchQuery);
  }, [language, searchQuery]);

  // Filtrage des Pokémon en fonction de la recherche et des types sélectionnés
  useEffect(() => {
    const result = pokemonList.filter((pokemon) => {
      const matchesSearch = pokemon.name[language]
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType.length === 0 || // Si aucun type n'est sélectionné, tous les Pokémon sont affichés
        pokemon.type.some((type) => selectedType.includes(type.toLowerCase()));

      return matchesSearch && matchesType;
    });

    setFilteredPokemons(result);
  }, [language, searchQuery, selectedType]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Router>
      <div className="App">
        <Container sx={{ marginTop: "20px" }}>
          <Navbar
            setLanguage={setLanguage}
            setSearchQuery={setSearchQuery}
            setFilteredPokemons={setFilteredPokemons}
            language={language}
          />
          {/* Boutons des types */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              margin: "20px 0",
            }}
          >
            {Object.keys(pokeTypeColors)
              .slice(0, 18) // Limiter à 18 types
              .map((type) => (
                <Button
                  key={type}
                  onClick={() =>
                    setSelectedType(
                      (prevTypes) =>
                        prevTypes.includes(type)
                          ? prevTypes.filter((t) => t !== type) // Désélectionner si déjà sélectionné
                          : [...prevTypes, type] // Ajouter le type si non sélectionné
                    )
                  }
                  sx={{
                    backgroundColor: selectedType.includes(type)
                      ? pokeTypeColors[type]
                      : "gray",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    boxShadow: selectedType.includes(type)
                      ? `0 0 10px ${pokeTypeColors[type]}`
                      : "none",
                    "&:hover": {
                      boxShadow: `0 0 10px ${pokeTypeColors[type]}`,
                    },
                    margin: "5px", // Espacement
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
          </Box>
          {/* Liste des Pokémon */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {currentPokemons.map((pokemon) => (
                      <PokemonPreviewCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        language={language}
                      />
                    ))}
                  </div>
                  {/* Pagination */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "20px 0",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      sx={{ marginRight: "10px" }}
                    >
                      Précédent
                    </Button>
                    {getPageNumbers().map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "contained" : "outlined"
                        }
                        onClick={() => handlePageChange(pageNumber)}
                        sx={{ margin: "0 5px" }}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button
                      variant="contained"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      sx={{ marginLeft: "10px" }}
                    >
                      Suivant
                    </Button>
                  </Box>
                </>
              }
            />
            <Route
              path="/pokemon/:pokemonId"
              element={<PokemonDetailPage language={language} />}
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
