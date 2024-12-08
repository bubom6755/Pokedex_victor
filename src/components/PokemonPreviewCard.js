import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Chip,
  Box,
} from "@mui/material";
import lazyLoadGif from "../img/lazyload.gif";
import translations from "../data/translations.json"; // Importer le fichier de traductions
import pokeTypeColors from "../data/pokeTypeColors"; // Importer le fichier des couleurs

const PokemonPreviewCard = ({ pokemon, language }) => {
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  const handleImageLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCardClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  useEffect(() => {
    // Traduire les types en fonction de la langue sélectionnée
    const translatedTypes = pokemon.type.map(
      (type) => translations.types[language][type.toLowerCase()] || type
    );
    setTypes(translatedTypes);
  }, [pokemon, language]);

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2e2e2e",
        color: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        width: "300px",
        height: "400px",
        marginTop: "50px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px) scale(1.05)",
          boxShadow: (theme) =>
            `0 2px 10px ${pokeTypeColors[types[0]?.toLowerCase()] || "#000"}`,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
          height: "200px",
          width: "200px",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "6rem",
            fontWeight: "bold",
            color: "white",
            opacity: 0.2,
            zIndex: -1,
          }}
        >
          #{pokemon.id}
        </Typography>

        {loading && (
          <CardMedia
            component="img"
            image={lazyLoadGif}
            alt="loading"
            sx={{
              marginTop: "50px",
              width: "200px",
              height: "200px",
              objectFit: "contain",
            }}
          />
        )}
        <CardMedia
          component="img"
          image={pokemon.image.hires}
          alt={pokemon.name[language]}
          onLoad={handleImageLoad}
          sx={{
            width: "200px",
            height: "200px",
            marginTop: "50px",
            objectFit: "contain",
            display: loading ? "none" : "block",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
      </Box>

      <CardContent
        sx={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}
        >
          {pokemon.name[language]}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {types.map((type) => {
            const typeKey = type.toLowerCase() || type;
            const typeColor = pokeTypeColors[typeKey] || "#000";
            return (
              <Chip
                key={type}
                label={type}
                sx={{
                  backgroundColor: typeColor,
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokemonPreviewCard;
