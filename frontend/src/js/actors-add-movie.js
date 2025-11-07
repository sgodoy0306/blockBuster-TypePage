const API_URL_MOVIES = "http://localhost:3001/api/movies";
const API_URL_ACTORS = "http://localhost:3001/api/actors";

const movieSelect = document.getElementById("movie-select");
const actorSearch = document.getElementById("actor-search");
const actorSuggestions = document.getElementById("actor-suggestions");
const selectedActorsContainer = document.getElementById("selected-actors");
const selectedActorsList = document.getElementById("selected-actors-list");
const currentActorsContainer = document.getElementById("current-actors");
const currentActorsList = document.getElementById("current-actors-list");
const form = document.getElementById("add-actor-movie-form");
const message = document.getElementById("message");

let allActors = [];
let selectedActors = [];
let currentActors = [];

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

// Load all actors
async function loadActors() {
    try {
        const response = await fetch(API_URL_ACTORS);
        if (!response.ok) throw new Error("Failed to load actors");
        allActors = await response.json();
    } catch (error) {
        console.error("Error loading actors:", error);
        message.textContent = "Error loading actors";
        message.className = "font-body text-center mt-2 text-red-500";
    }
}

// Load current actors for selected movie
async function loadCurrentActors(movieId) {
    try {
        const response = await fetch(`http://localhost:3001/api/movie/${movieId}/actors`);
        if (!response.ok) throw new Error("Failed to load current actors");
        currentActors = await response.json();
        updateCurrentActorsList();
    } catch (error) {
        console.error("Error loading current actors:", error);
        currentActors = [];
        updateCurrentActorsList();
    }
}

// Update the visual list of current actors
function updateCurrentActorsList() {
    if (currentActors.length === 0) {
        currentActorsContainer.classList.add('hidden');
        return;
    }

    currentActorsContainer.classList.remove('hidden');
    currentActorsList.innerHTML = currentActors.map(actor => 
        `<div class="flex items-center justify-between bg-yellow-100 p-2 rounded border">
                    <span class="font-semibold">${actor.name}</span>
                    <button type="button" class="text-red-600 hover:text-red-800 font-bold text-lg" onclick="removeCurrentActorFromMovie(${actor.id})">
                        ✕
                    </button>
                </div>`
    ).join('');
}

// Remove current actor from movie
async function removeCurrentActorFromMovie(actorId) {
    const movieId = movieSelect.value;
    if (!movieId) return;

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    try {
        const response = await fetch(`http://localhost:3001/api/movie/${movieId}/actor/${actorId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        if (response.ok) {
            message.textContent = "Actor removed from movie successfully!";
            message.className = "font-body text-center mt-2 text-green-500";
            await loadCurrentActors(movieId);
            
            setTimeout(() => {
                message.textContent = "";
                message.className = "font-body text-center mt-2";
            }, 2000);
        } else {
            message.textContent = "Error removing actor from movie";
            message.className = "font-body text-center mt-2 text-red-500";
        }
    } catch (error) {
        console.error("Error removing actor:", error);
        message.textContent = "Error removing actor from movie";
        message.className = "font-body text-center mt-2 text-red-500";
    }
}

// Filter and show actor suggestions (updated to exclude current actors)
function showActorSuggestions(searchTerm) {
    if (!searchTerm.trim()) {
        actorSuggestions.innerHTML = '';
        actorSuggestions.classList.add('hidden');
        return;
    }

    const filtered = allActors.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedActors.find(selected => selected.id === actor.id) &&
        !currentActors.find(current => current.id === actor.id)
    );

    if (filtered.length === 0) {
        actorSuggestions.innerHTML = '<div class="p-2 text-gray-500">No actors found</div>';
    } else {
        actorSuggestions.innerHTML = filtered.map(actor => 
            `<div class="p-2 hover:bg-blockbuster-100 cursor-pointer border-b border-blockbuster-100" data-actor-id="${actor.id}" data-actor-name="${actor.name}">
                        ${actor.name}
                    </div>`
        ).join('');
    }
    actorSuggestions.classList.remove('hidden');
}

// Add actor to selected list
function addActorToSelected(actor) {
    if (selectedActors.find(selected => selected.id === actor.id)) return;

    selectedActors.push(actor);
    updateSelectedActorsList();
    actorSearch.value = '';
    actorSuggestions.classList.add('hidden');
}

// Remove actor from selected list
function removeActorFromSelected(actorId) {
    selectedActors = selectedActors.filter(actor => actor.id !== actorId);
    updateSelectedActorsList();
}

// Update the visual list of selected actors
function updateSelectedActorsList() {
    if (selectedActors.length === 0) {
        selectedActorsContainer.classList.add('hidden');
        return;
    }

    selectedActorsContainer.classList.remove('hidden');
    selectedActorsList.innerHTML = selectedActors.map(actor => 
        `<div class="flex items-center justify-between bg-blockbuster-100 p-2 rounded border">
                    <span class="font-semibold">${actor.name}</span>
                    <button type="button" class="text-red-600 hover:text-red-800 font-bold text-lg" onclick="removeActorFromSelected(${actor.id})">
                        ✕
                    </button>
                </div>`
    ).join('');
}

// Event listeners
actorSearch.addEventListener('input', (e) => {
    showActorSuggestions(e.target.value);
});

actorSuggestions.addEventListener('click', (e) => {
    const actorElement = e.target.closest('[data-actor-id]');
    if (actorElement) {
        const actor = {
            id: parseInt(actorElement.dataset.actorId),
            name: actorElement.dataset.actorName
        };
        addActorToSelected(actor);
    }
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!actorSearch.contains(e.target) && !actorSuggestions.contains(e.target)) {
        actorSuggestions.classList.add('hidden');
    }
});

// Handle form submission
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const movieId = movieSelect.value;

    if (!movieId) {
        message.textContent = "Please select a movie";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    }

    if (selectedActors.length === 0) {
        message.textContent = "Please select at least one actor";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    }

    try {
        let successCount = 0;
        let errorCount = 0;

        for (const actor of selectedActors) {
            try {
                const response = await fetch(`http://localhost:3001/api/movie/${movieId}/actors`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? `Bearer ${token}` : ""
                    },
                    body: JSON.stringify({
                        actor_id: actor.id
                    }),
                });

                if (response.ok) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
            }
        }

        if (successCount > 0) {
            message.textContent = `${successCount} actor(s) added successfully!`;
            message.className = "font-body text-center mt-2 text-green-500";
            selectedActors = [];
            updateSelectedActorsList();
            movieSelect.value = "";
        }

        if (errorCount > 0) {
            message.textContent += ` ${errorCount} actor(s) failed to add.`;
            message.className = "font-body text-center mt-2 text-yellow-600";
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
        await loadCurrentActors(movieId);
        // Clear selected actors when changing movie
        selectedActors = [];
        updateSelectedActorsList();
        actorSearch.value = '';
        actorSuggestions.classList.add('hidden');
    } else {
        currentActors = [];
        updateCurrentActorsList();
        selectedActors = [];
        updateSelectedActorsList();
    }
});

// Make functions available globally
window.removeActorFromSelected = removeActorFromSelected;
window.removeCurrentActorFromMovie = removeCurrentActorFromMovie;

// Load data on page load
document.addEventListener("DOMContentLoaded", function() {
    loadMovies();
    loadActors();
});
