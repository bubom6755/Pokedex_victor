import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import FlagUs from "../img/flag/us.png";
import FlagFr from "../img/flag/fr.png";
import FlagJp from "../img/flag/jp.png";
import FlagCh from "../img/flag/ch.webp";
import "./Navbar.css";

const Navbar = ({ setLanguage, setSearchQuery }) => {
  const [language, setLang] = useState("english");
  const [borderStyle, setBorderStyle] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const translations = {
    english: "Search for your Pokémon ",
    french: "Chercher votre pokémon ",
    japanese: "ポケモンを探す",
    chinese: "搜寻你的神奇宝贝",
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setBorderStyle(query ? "2px solid #FFD700" : "2px solid rgb(41, 41, 41)");
    }, 500);

    setTypingTimeout(timeout);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLang(selectedLanguage);
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1a1a1a" }}>
      <Toolbar>
        <Box
          sx={{ display: "flex", alignItems: "center", marginRight: "20px" }}
        >
          <Link to=" ">
            <img
              src={require("../img/pokedexlogo.png")}
              alt="Pokédex Logo"
              style={{ width: "100px", height: "40px", marginRight: "10px" }}
            />
          </Link>
        </Box>

        <TextField
          label={translations[language]}
          variant="outlined"
          onChange={handleSearchChange}
          style={{
            marginRight: "20px",
            color: "white",
            flexGrow: 1,
            borderRadius: "8px",
            border: borderStyle,
            transition: "border 0.3s ease",
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />

        <FormControl style={{ marginLeft: "20px" }}>
          <Select value={language} onChange={handleLanguageChange}>
            <MenuItem value="english">
              <img src={FlagUs} alt="English" width="20px" />
            </MenuItem>
            <MenuItem value="french">
              <img src={FlagFr} alt="Français" width="20px" />
            </MenuItem>
            <MenuItem value="japanese">
              <img src={FlagJp} alt="日本語" width="20px" />
            </MenuItem>
            <MenuItem value="chinese">
              <img src={FlagCh} alt="Chinese" width="20px" />
            </MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
