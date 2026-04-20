const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let comments = [];

app.get("/", (req, res) => {
  res.send("Comments service working");
});

app.get("/comments", (req, res) => {
  res.json(comments);
});

app.post("/comments", (req, res) => {
  const { country, comment } = req.body;

  if (!country || !comment) {
    return res.status(400).json({ message: "Falten dades" });
  }

  comments.push({ country, comment });

  res.status(201).json({
    message: "Comentari guardat"
  });
});

/* BORRAR COMENTARI PER INDEX */
app.delete("/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 0 || id >= comments.length) {
    return res.status(404).json({
      message: "Comentari no trobat"
    });
  }

  comments.splice(id, 1);

  res.json({
    message: "Comentari eliminat"
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});