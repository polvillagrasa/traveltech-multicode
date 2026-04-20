const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const commentInput = document.getElementById("commentInput");
const commentBtn = document.getElementById("commentBtn");

let currentCountry = "";

/*
  EN LOCAL:
  const FAVORITES_URL = "http://localhost:3001/favorites";
  const COMMENTS_URL = "http://localhost:3002/comments";
  const VISITED_URL = "http://localhost:3003/visited";

  EN PRODUCCIÓ:
  canvia aquestes URLs per les públiques de Render / Railway / Koyeb
*/

const FAVORITES_URL = "https://favorites-service-kxho.onrender.com/favorites";
const COMMENTS_URL = "https://comments-service-oqa7.onrender.com/comments";
const VISITED_URL = "https://visited-service-d4mz.onrender.com/visited";

searchBtn.addEventListener("click", searchCountry);
commentBtn.addEventListener("click", addComment);

async function searchCountry() {
  const country = countryInput.value.trim();

  if (!country) {
    alert("Escriu un país");
    return;
  }

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultDiv.innerHTML = "<p>No s'ha trobat cap país.</p>";
      return;
    }

    const c = data[0];
    currentCountry = c.name.common;

    resultDiv.innerHTML = `
      <h2>${c.name.common}</h2>
      <img src="${c.flags.png}" alt="Bandera de ${c.name.common}" width="150">
      <p><strong>Capital:</strong> ${c.capital ? c.capital[0] : "No disponible"}</p>
      <p><strong>Regió:</strong> ${c.region}</p>
      <p><strong>Població:</strong> ${c.population}</p>
      <button onclick="addFavorite('${c.name.common}', '${c.capital ? c.capital[0] : ""}')">Afegir a favorits</button>
      <button onclick="markVisited('${c.name.common}')">Marcar com visitat</button>
    `;
  } catch (error) {
    console.error("Error buscant país:", error);
    resultDiv.innerHTML = "<p>Error en buscar el país.</p>";
  }
}

async function addFavorite(name, capital) {
  try {
    const response = await fetch(FAVORITES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, capital })
    });

    const data = await response.json();
    alert(data.message || "Afegit a favorits");
    loadFavorites();
  } catch (error) {
    console.error("Error afegint favorit:", error);
  }
}

async function addComment() {
  const comment = commentInput.value.trim();

  if (!currentCountry) {
    alert("Primer has de cercar un país");
    return;
  }

  if (!comment) {
    alert("Escriu un comentari");
    return;
  }

  try {
    const response = await fetch(COMMENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: currentCountry,
        comment: comment
      })
    });

    const data = await response.json();
    alert(data.message || "Comentari guardat");
    commentInput.value = "";
    loadComments();
  } catch (error) {
    console.error("Error guardant comentari:", error);
  }
}

async function markVisited(name) {
  try {
    const response = await fetch(VISITED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    const data = await response.json();
    alert(data.message || "País marcat com visitat");
    loadVisited();
  } catch (error) {
    console.error("Error marcant visitat:", error);
  }
}

async function loadFavorites() {
  try {
    const response = await fetch(FAVORITES_URL);
    const data = await response.json();

    const list = document.getElementById("favoritesList");
    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.capital || "Sense capital"}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error carregant favorits:", error);
  }
}

async function loadComments() {
  try {
    const response = await fetch(COMMENTS_URL);
    const data = await response.json();

    const list = document.getElementById("commentsList");
    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.country}: ${item.comment}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error carregant comentaris:", error);
  }
}

async function loadVisited() {
  try {
    const response = await fetch(VISITED_URL);
    const data = await response.json();

    const list = document.getElementById("visitedList");
    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.name;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error carregant visitats:", error);
  }
}