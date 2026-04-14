const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let favorites = [];

app.get("/favorites", (req, res) => {
  res.json(favorites);
});

app.post("/favorites", (req, res) => {
  const { name, capital } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Falta el nom del país" });
  }

  const exists = favorites.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (exists) {
    return res.status(400).json({ message: "Aquest país ja està a favorits" });
  }

  favorites.push({ name, capital });
  res.status(201).json({ message: "País afegit a favorits" });
});

app.delete("/favorites/:name", (req, res) => {
  const name = req.params.name;
  favorites = favorites.filter(item => item.name.toLowerCase() !== name.toLowerCase());
  res.json({ message: "País eliminat de favorits" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Favorites service running on port ${PORT}`);
});