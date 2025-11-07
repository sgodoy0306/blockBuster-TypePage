const API_URL = "http://localhost:3001/api/movies";
const API_URL_STUDIOS = "http://localhost:3001/api/film_studios";
const API_URL_GENRES = "http://localhost:3001/api/genres";

let allMovies = [];
let allStudios = [];
let allGenres = [];
let filteredMovies = [];

const moviesGrid = document.getElementById('movies-grid');
const genreFilter = document.getElementById('genre-filter');
const searchInput = document.getElementById('search-input');
const clearFiltersBtn = document.getElementById('clear-filters');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const noResults = document.getElementById('no-results');

// Load movies, studios, and genres
async function loadData() {
    try {
        loading.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        const [moviesResponse, studiosResponse, genresResponse] = await Promise.all([
            fetch(API_URL),
            fetch(API_URL_STUDIOS),
            fetch(API_URL_GENRES)
        ]);

        if (!moviesResponse.ok || !studiosResponse.ok || !genresResponse.ok) {
            throw new Error('Failed to load data');
        }

        allMovies = await moviesResponse.json();
        allStudios = await studiosResponse.json();
        allGenres = await genresResponse.json();

        // Load genres for each movie
        await loadMovieGenres();

        populateGenreFilter();
        filteredMovies = [...allMovies];
        displayMovies();
        loading.classList.add('hidden');

    } catch (error) {
        console.error('Error loading data:', error);
        loading.classList.add('hidden');
        errorMessage.textContent = 'Error loading movies. Please try again later.';
        errorMessage.classList.remove('hidden');
    }
}

// Load genres for each movie
async function loadMovieGenres() {
    const movieGenrePromises = allMovies.map(async (movie) => {
        try {
            const response = await fetch(`http://localhost:3001/api/movie/${movie.id}/genres`);
            if (response.ok) {
                movie.genres = await response.json();
            } else {
                movie.genres = [];
            }
        } catch (error) {
            console.error(`Error loading genres for movie ${movie.id}:`, error);
            movie.genres = [];
        }
    });

    await Promise.all(movieGenrePromises);
}

// Populate genre filter options
function populateGenreFilter() {
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    
    allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
}

// Get studio name by ID
function getStudioName(studioId) {
    const studio = allStudios.find(s => s.id === studioId);
    return studio ? studio.name : 'Unknown Studio';
}

// Get genres display for a movie
function getMovieGenresDisplay(movie) {
    if (movie.genres && movie.genres.length > 0) {
        return movie.genres.map(g => `<span class="genre-badge">${g.name}</span>`).join('');
    }
    return '<span class="text-gray-500 text-sm">No genres</span>';
}

// Display movies
function displayMovies() {
    if (filteredMovies.length === 0) {
        moviesGrid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    moviesGrid.innerHTML = filteredMovies.map(movie => `
        <div class="movie-card bg-white/95 rounded-lg shadow-lg overflow-hidden hover:shadow-xl cursor-pointer" data-movie-id="${movie.id}">
            <div class="relative">
                <img src="${movie.image_path}" alt="${movie.name}" class="w-full h-64 object-cover" onerror="this.src='templates/default-movie-poster.jpg'">
                <div class="absolute top-3 right-3 bg-blockbuster-700 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ${movie.mpa_rating}
                </div>
                <div class="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${movie.duration} min
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-blockbuster-700 mb-4 font-display">${movie.name}</h3>
                <div class="space-y-3 mb-4">
                    <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Year:</strong> ${movie.year}</p>
                    <div class="text-gray-600 text-sm font-body">
                        <strong class="text-blockbuster-600">Genres:</strong><br>
                        <div class="mt-1">${getMovieGenresDisplay(movie)}</div>
                    </div>
                    <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Director:</strong> ${movie.director}</p>
                    <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Studio:</strong> ${getStudioName(movie.film_studio_id)}</p>
                </div>
                <p class="text-gray-700 text-sm mb-5 line-clamp-3 font-body">${movie.description}</p>
                <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span class="text-3xl font-bold text-green-600 font-display">$${movie.price}</span>
                    <span class="text-sm ${movie.stock > 0 ? 'text-gray-500' : 'text-red-600'} bg-gray-100 px-3 py-2 rounded-full font-semibold">${movie.stock > 0 ? `Stock: ${movie.stock}` : '<span class="font-bold">Out of stock</span>'}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event listeners to movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            const movie = allMovies.find(m => m.id == movieId);
            showMovieModal(movie);
        });
    });
}

// Modal logic
const movieModal = document.getElementById('movie-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');

function showMovieModal(movie) {
    modalContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${movie.image_path}" alt="${movie.name}" class="w-48 h-64 object-cover rounded-lg shadow-md mb-4 md:mb-0">
            <div class="flex-1">
                <h2 class="text-3xl font-bold text-blockbuster-700 mb-2 font-display">${movie.name}</h2>
                <div class="mb-2">${getMovieGenresDisplay(movie)}</div>
                <p class="text-gray-600 mb-1"><strong>Year:</strong> ${movie.year}</p>
                <p class="text-gray-600 mb-1"><strong>Director:</strong> ${movie.director}</p>
                <p class="text-gray-600 mb-1"><strong>Studio:</strong> ${getStudioName(movie.film_studio_id)}</p>
                <p class="text-gray-600 mb-1"><strong>Duration:</strong> ${movie.duration} min</p>
                <p class="text-gray-600 mb-1"><strong>MPA Rating:</strong> ${movie.mpa_rating}</p>
                <p class="text-gray-700 mt-4 mb-4">${movie.description}</p>
                <div class="flex items-center gap-4 mb-4">
                    <span class="text-2xl font-bold text-green-600 font-display">$${movie.price}</span>
                    <span class="text-sm ${movie.stock > 0 ? 'text-gray-500' : 'text-red-600'} bg-gray-100 px-3 py-2 rounded-full font-semibold">${movie.stock > 0 ? `Stock: <span id="modal-stock">${movie.stock}</span>` : '<span class="font-bold">Out of stock</span>'}</span>
                </div>
                <button id="reserve-btn" class="bg-blockbuster-700 hover:bg-blockbuster-500 text-yellow-300 font-bold py-2 px-6 rounded transition-colors duration-200 shadow-md font-display text-xl" ${movie.stock <= 0 ? 'disabled' : ''}>
                    ${movie.stock > 0 ? 'Reserve' : 'Out of stock'}
                </button>
                <div id="reserve-message" class="mt-2 text-lg font-body"></div>
            </div>
        </div>
    `;
    movieModal.classList.remove('hidden');

    // Reservation logic
    document.getElementById('reserve-btn').onclick = async function() {
        this.disabled = true;
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            document.getElementById('reserve-message').textContent = 'You must be logged in to reserve.';
            this.disabled = false;
            return;
        }
        try {
            const res = await fetch(`http://localhost:3001/api/movie/${movie.id}/reserve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                document.getElementById('reserve-message').textContent = 'Reservation successful!';
                // Update stock in modal and card
                movie.stock--;
                document.getElementById('modal-stock').textContent = movie.stock;
                displayMovies();
            } else {
                const error = await res.text();
                document.getElementById('reserve-message').textContent = 'Error: ' + error;
                this.disabled = false;
            }
        } catch (err) {
            document.getElementById('reserve-message').textContent = 'Connection error.';
            this.disabled = false;
        }
    };
}

closeModalBtn.onclick = function() {
    movieModal.classList.add('hidden');
};
// Close modal when clicking outside the content
movieModal.addEventListener('click', function(e) {
    if (e.target === movieModal) movieModal.classList.add('hidden');
});

// Filter movies
function filterMovies() {
    const selectedGenreId = genreFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    filteredMovies = allMovies.filter(movie => {
        // Check if movie has the selected genre
        const matchesGenre = !selectedGenreId || 
            (movie.genres && movie.genres.some(g => g.id.toString() === selectedGenreId));
        
        // Check if movie matches search term
        const movieGenresText = movie.genres && movie.genres.length > 0 
            ? movie.genres.map(g => g.name).join(' ').toLowerCase()
            : '';
        const studioName = getStudioName(movie.film_studio_id).toLowerCase();
        
        const matchesSearch = !searchTerm || 
            movie.name.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movieGenresText.includes(searchTerm) ||
            studioName.includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm);

        return matchesGenre && matchesSearch;
    });

    displayMovies();
}

// Clear all filters
function clearFilters() {
    genreFilter.value = '';
    searchInput.value = '';
    filteredMovies = [...allMovies];
    displayMovies();
}

// Event listeners
genreFilter.addEventListener('change', filterMovies);
searchInput.addEventListener('input', filterMovies);
clearFiltersBtn.addEventListener('click', clearFilters);

// Helper to get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Load data on page load and apply search filter if present
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    const searchQuery = getQueryParam('search');
    if (searchQuery) {
        searchInput.value = searchQuery;
        filterMovies();
    }
});
