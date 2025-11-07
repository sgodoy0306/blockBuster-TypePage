const API_URL_MOVIES = "http://localhost:3001/api/movies";
const API_URL_GENRES = "http://localhost:3001/api/genres";

const movieSelect = document.getElementById("movie-select");
const genreSelect = document.getElementById("genre-select");
const currentGenresContainer = document.getElementById("current-genres");
const currentGenresList = document.getElementById("current-genres-list");
const form = document.getElementById("add-genre-movie-form");
const message = document.getElementById("message");

let allGenres = [];
let currentGenres = [];

// Load movies into select
async function loadMovies() {
    try {
        const response = await fetch(API_URL_MOVIES);
        if (!response.ok) throw new Error("Failed to load movies");
        const movies = await response.json();
        
        movieSelect.innerHTML = '<option value="">-- Select a movie --</option>';
        movies.forEach(movie => {
            const option = document.createElement("option");
            option.value = movie.id;
            option.textContent = movie.name;
            movieSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading movies:", error);
        message.textContent = "Error loading movies";
        message.className = "font-body text-center mt-2 text-red-500";
    }
}

// Load all genres
async function loadGenres() {
    try {
        const response = await fetch(API_URL_GENRES);
        if (!response.ok) throw new Error("Failed to load genres");
        allGenres = await response.json();
        
        genreSelect.innerHTML = '<option value="">-- Select a genre --</option>';
        allGenres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading genres:", error);
        message.textContent = "Error loading genres";
        message.className = "font-body text-center mt-2 text-red-500";
    }
}

// Load current genres for selected movie
async function loadCurrentGenres(movieId) {
    try {
        const response = await fetch(`http://localhost:3001/api/movie/${movieId}/genres`);
        if (!response.ok) throw new Error("Failed to load current genres");
        currentGenres = await response.json();
        updateCurrentGenresList();
        updateAvailableGenres();
    } catch (error) {
        console.error("Error loading current genres:", error);
        currentGenres = [];
        updateCurrentGenresList();
        updateAvailableGenres();
    }
}

// Update the visual list of current genres
function updateCurrentGenresList() {
    if (currentGenres.length === 0) {
        currentGenresContainer.classList.add('hidden');
        return;
    }

    currentGenresContainer.classList.remove('hidden');
    currentGenresList.innerHTML = currentGenres.map(genre => 
        `<div class="flex items-center justify-between bg-yellow-100 p-2 rounded border">
                    <span class="font-semibold">${genre.name}</span>
                    <button type="button" class="text-red-600 hover:text-red-800 font-bold text-lg" onclick="removeCurrentGenreFromMovie(${genre.id})">
                        ✕
                    </button>
                </div>`
    ).join('');
}

// Update available genres (remove those already assigned)
function updateAvailableGenres() {
    const currentGenreIds = currentGenres.map(g => g.id);
    genreSelect.innerHTML = '<option value="">-- Select a genre --</option>';
    allGenres
        .filter(genre => !currentGenreIds.includes(genre.id))
        .forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
}

// Remove current genre from movie
async function removeCurrentGenreFromMovie(genreId) {
    const movieId = movieSelect.value;
    if (!movieId) return;

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    try {
        const response = await fetch(`http://localhost:3001/api/movie/${movieId}/genre/${genreId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        if (response.ok) {
            message.textContent = "Genre removed from movie successfully!";
            message.className = "font-body text-center mt-2 text-green-500";
            await loadCurrentGenres(movieId);
            
            setTimeout(() => {
                message.textContent = "";
                message.className = "font-body text-center mt-2";
            }, 2000);
        } else {
            message.textContent = "Error removing genre from movie";
            message.className = "font-body text-center mt-2 text-red-500";
        }
    } catch (error) {
        console.error("Error removing genre:", error);
        message.textContent = "Error removing genre from movie";
        message.className = "font-body text-center mt-2 text-red-500";
    }
}

// Handle form submission
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const movieId = movieSelect.value;
    const genreId = genreSelect.value;

    if (!movieId) {
        message.textContent = "Please select a movie";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    }

    if (!genreId) {
        message.textContent = "Please select a genre";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/movie/${movieId}/genres`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify({
                genre_id: parseInt(genreId)
            }),
        });

        if (response.ok) {
            message.textContent = "Genre added successfully!";
            message.className = "font-body text-center mt-2 text-green-500";
            genreSelect.value = "";
            await loadCurrentGenres(movieId);
        } else {
            const errorData = await response.text();
            message.textContent = "Error adding genre: " + errorData;
            message.className = "font-body text-center mt-2 text-red-500";
        }

    } catch (error) {
        console.error("Error:", error);
        message.textContent = "Internal server error";
        message.className = "font-body text-center mt-2 text-red-500";
    }

    setTimeout(() => {
        message.textContent = "";
        message.className = "font-body text-center mt-2";
    }, 4000);
});

// Add event listener for movie selection
movieSelect.addEventListener('change', async function() {
    const movieId = this.value;
    if (movieId) {
        await loadCurrentGenres(movieId);
        genreSelect.value = '';
    } else {
        currentGenres = [];
        updateCurrentGenresList();
        updateAvailableGenres();
    }
});

// Make functions available globally
window.removeCurrentGenreFromMovie = removeCurrentGenreFromMovie;

// Load data on page load
document.addEventListener("DOMContentLoaded", function() {
    loadMovies();
    loadGenres();
});
