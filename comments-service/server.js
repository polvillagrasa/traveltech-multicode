const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let comments = [];

app.get("/comments", (req, res) => {
  res.json(comments);
});

app.get("/comments/:country", (req, res) => {
  const country = req.params.country.toLowerCase();

  const filteredComments = comments.filter(
    item => item.country.toLowerCase() === country
  );

  res.json(filteredComments);
});

app.post("/comments", (req, res) => {
  const { country, comment } = req.body;

  if (!country || !comment) {
    return res.status(400).json({ message: "Falten dades" });
  }

  comments.push({ country, comment });
  res.status(201).json({ message: "Comentari guardat" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});