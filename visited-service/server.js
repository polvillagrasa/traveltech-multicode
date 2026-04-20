const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let visited = [];

app.get("/visited", (req, res) => {
  res.json(visited);
});

app.post("/visited", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Falta el nom del país" });
  }

  const exists = visited.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (exists) {
    return res.status(400).json({ message: "Aquest país ja està a visitats" });
  }

  visited.push({ name });
  res.status(201).json({ message: "Afegit a visitats" });
});

app.delete("/visited/:name", (req, res) => {
  const name = req.params.name;

  visited = visited.filter(
    item => item.name.toLowerCase() !== name.toLowerCase()
  );

  res.json({ message: "Eliminat de visitats" });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Visited service running on port ${PORT}`);
});