const API_URL = "http://localhost:3000/movies";

const movieList = document.getElementById("movieList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("movieModal");
const openAddModal = document.getElementById("openAddModal");
const closeModal = document.getElementById("closeModal");
const movieForm = document.getElementById("movieForm");
const modalTitle = document.getElementById("modalTitle");
const title = document.getElementById("title");
const genre = document.getElementById("genre");
const year = document.getElementById("year");

let editId = null;
function showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
async function loadMovies() {
    const res = await fetch(API_URL);
    let movies = await res.json();

    const search = searchInput.value.toLowerCase();
    movies = movies.filter(m =>
        m.title.toLowerCase().includes(search) ||
        m.genre.toLowerCase().includes(search)
    );
    const sort = sortSelect.value;
    if (sort === "title-asc") movies.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title-desc") movies.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "year-new") movies.sort((a, b) => b.year - a.year);
    if (sort === "year-old") movies.sort((a, b) => a.year - b.year);

    movieList.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <h3>${movie.title} <span>(${movie.year})</span></h3>
            <p>Genre: ${movie.genre}</p>

            <div class="card-btns">
                <button class="edit-btn" onclick="editMovie(${movie.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
            </div>
        `;
        movieList.appendChild(card);
    });
}
openAddModal.onclick = () => {
    modal.style.display = "block";
    modalTitle.textContent = "Add New Movie";
    editId = null;
};
closeModal.onclick = () => modal.style.display = "none";
movieForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newMovie = {
        title: title.value,
        genre: genre.value,
        year: parseInt(year.value)
    };

    if (editId) {
        await fetch(`${API_URL}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMovie)
        });
        showToast("Movie Updated!");
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMovie)
        });
        showToast("Movie Added!");
    }

    modal.style.display = "none";
    movieForm.reset();
    loadMovies();
});
async function editMovie(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const movie = await res.json();

    modal.style.display = "block";
    modalTitle.textContent = "Edit Movie";

    title.value = movie.title;
    genre.value = movie.genre;
    year.value = movie.year;

    editId = id;
}
async function deleteMovie(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    showToast("Movie Deleted!");
    loadMovies();
}
searchInput.oninput = loadMovies;
sortSelect.onchange = loadMovies;
const themeToggle = document.getElementById("themeToggle");
let darkMode = true;

themeToggle.onclick = () => {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? "#0f0f0f" : "white";
    document.body.style.color = darkMode ? "white" : "black";
    themeToggle.textContent = darkMode ? " Dark" : "Light";
};
window.editMovie = editMovie;
window.deleteMovie = deleteMovie;

loadMovies();

