import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const PokemonDetailPage = () => {
  const { pokemonId } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evolutions, setEvolutions] = useState([]);

  const [openDialog, setOpenDialog] = useState(false); // Pour gérer l'ouverture du Dialog
  const [moves, setMoves] = useState([]); // Pour stocker les attaques

  const handleDialogOpen = () => {
    setOpenDialog(true); // Ouvre le dialog
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Ferme le dialog
  };

  const getTypeColor = (type) => {
    const typeColors = {
      fire: "#F08030",
      water: "#6890F0",
      grass: "#78C850",
      electric: "#F8D030",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
      normal: "#A8A878",
    };
    return typeColors[type] || "#000";
  };

  useEffect(() => {
    fetchPokemonData();
  }, [pokemonId]);

  const fetchPokemonData = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
      );
      const pokemonInfo = await response.json();
      const speciesInfo = await speciesResponse.json();

      setPokemon({ ...pokemonInfo, species: speciesInfo });
      setLoading(false);

      const evolutionResponse = await fetch(speciesInfo.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();
      setEvolutions(extractEvolutions(evolutionData.chain));
      setMoves(pokemonInfo.moves);
    } catch (error) {
      console.error("Erreur lors du chargement des données Pokémon :", error);
      setLoading(false);
    }
  };

  const extractEvolutions = (chain) => {
    const evolutionsList = [];
    let current = chain;
    while (current) {
      evolutionsList.push({
        name: current.species.name,
        id: current.species.url.split("/").slice(-2)[0],
      });
      current = current.evolves_to[0];
    }
    return evolutionsList;
  };

  const goToPreviousPokemon = () => {
    const prevId = parseInt(pokemonId) - 1;
    if (prevId > 0) navigate(`/pokemon/${prevId}`);
  };

  const goToNextPokemon = () => {
    const nextId = parseInt(pokemonId) + 1;
    if (nextId <= 1010) navigate(`/pokemon/${nextId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1c1c1e",
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "24px", color: "#888" }}>
          Loading Pokémon data...
        </Typography>
      </Box>
    );
  }

  if (!pokemon) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1c1c1e",
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "24px", color: "#f00" }}>
          Pokémon not found!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        fontFamily: "Montserrat, sans-serif",
        padding: "20px",
        backgroundColor: "#1c1c1e",
        color: "#fff",
        borderRadius: "10px",
        maxWidth: "800px",
        margin: "auto",
        marginTop: "30px",
        marginBottom: "30px",
        boxShadow: `0px 4px 8px ${getTypeColor(pokemon.types[0].type.name)}`,
      }}
    >
      {/* Nom */}
      <Typography
        variant="h1"
        sx={{
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
          color: getTypeColor(pokemon.types[0].type.name),
          marginBottom: "20px",
        }}
      >
        {pokemon.name.toUpperCase()}
      </Typography>

      {/* Image */}
      <Box
        sx={{
          borderRadius: "15px",
          backgroundColor: "#2c2c2e",
          padding: "15px",
          width: "250px",
          height: "250px",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0px 4px 8px ${getTypeColor(pokemon.types[0].type.name)}`,
        }}
      >
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>

      {/* Types */}
      <Box
        sx={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {pokemon.types.map((typeInfo) => (
          <Typography
            key={typeInfo.type.name}
            sx={{
              padding: "10px",
              borderRadius: "10px",
              color: "#fff",
              backgroundColor: getTypeColor(typeInfo.type.name),
              fontWeight: "bold",
            }}
          >
            {typeInfo.type.name.toUpperCase()}
          </Typography>
        ))}
        <Button
          sx={{
            padding: "10px",
            backgroundColor: "#444",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
          }}
          onClick={handleDialogOpen}
        >
          See Moves
        </Button>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle
            sx={{
              backgroundColor: "#2e2e2e",
              color: "#fff",
            }}
          >
            Moves of {pokemon.name}
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: "#2e2e2e",
            }}
          >
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: "#2e2e2e",
              }}
            >
              {moves.map((move) => (
                <Typography
                  key={move.move.name}
                  sx={{ marginBottom: "10px", color: "white" }}
                >
                  {move.move.name}
                </Typography>
              ))}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: "#2e2e2e",
            }}
          >
            <Button
              onClick={handleDialogClose}
              sx={{
                color: "#fff", // Texte du bouton en blanc
                border: "none", // Enlever la bordure par défaut
                fontWeight: "bold",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Statistiques */}
      <Box>
        <Typography
          variant="h2"
          sx={{ fontSize: "24px", marginBottom: "10px" }}
        >
          Stats
        </Typography>
        {pokemon.stats.map((stat) => (
          <Box key={stat.stat.name} sx={{ marginBottom: "10px" }}>
            <Typography>{stat.stat.name.toUpperCase()}</Typography>
            <Box
              sx={{
                height: "10px",
                borderRadius: "5px",
                backgroundColor: "#444",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(stat.base_stat / 200) * 100}%`,
                  height: "100%",
                  backgroundColor: getTypeColor(pokemon.types[0].type.name),
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Évolutions */}
      <Box sx={{ marginTop: "20px" }}>
        <Typography
          variant="h2"
          sx={{ fontSize: "24px", marginBottom: "10px" }}
        >
          Evolutions
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {evolutions.map((evo) => (
            <Box
              key={evo.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#2e2e2e",
                borderRadius: "12px",
                padding: "10px",
                width: "150px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                alt={evo.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                {evo.name}
              </Typography>
              <Button
                sx={{
                  backgroundColor: "#3a3a3c",
                  color: "#fff",
                  borderRadius: "15px",
                  padding: "5px 10px",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  marginTop: "10px",
                }}
                onClick={() => navigate(`/pokemon/${evo.id}`)}
              >
                View Details
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button
          sx={{
            backgroundColor: "rgb(41, 41, 41)",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          onClick={goToPreviousPokemon}
        >
          Previous Pokémon
        </Button>
        <Button
          sx={{
            backgroundColor: "rgb(41, 41, 41)",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          onClick={goToNextPokemon}
        >
          Next Pokémon
        </Button>
      </Box>
    </Box>
  );
};

export default PokemonDetailPage;
