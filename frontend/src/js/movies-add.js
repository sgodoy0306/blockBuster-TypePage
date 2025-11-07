// Only allow one checkbox to be selected at a time
document.querySelectorAll('.mpa-checkbox').forEach(cb => {
    cb.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.mpa-checkbox').forEach(other => {
                if (other !== this) other.checked = false;
            });
        }
    });
});

// Load studios into the select
async function loadStudios() {
    const studioSelect = document.getElementById('film_studio_id');
    studioSelect.innerHTML = '<option value="">-- Select a studio --</option>';
    try {
        const res = await fetch('http://localhost:3001/api/film_studios');
        if (!res.ok) throw new Error("Failed to load studios");
        const studios = await res.json();
        studios.forEach(studio => {
            const option = document.createElement('option');
            option.value = studio.id;
            option.textContent = studio.name;
            studioSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading studios:", err);
    }
}

// Load genres into checkboxes
async function loadGenres() {
    const genresContainer = document.getElementById('genres-group');
    try {
        const res = await fetch('http://localhost:3001/api/genres');
        if (!res.ok) throw new Error("Failed to load genres");
        const genres = await res.json();
        genresContainer.innerHTML = genres.map(genre => 
            `<label class="flex items-center gap-2">
                        <input type="checkbox" class="genre-checkbox accent-blockbuster-700" value="${genre.id}" data-genre-name="${genre.name}"> 
                        ${genre.name}
                    </label>`
        ).join('');
    } catch (err) {
        console.error("Error loading genres:", err);
        genresContainer.innerHTML = '<p class="text-red-500">Failed to load genres</p>';
    }
}

async function addGenresToMovie(movieId, genreIds, token) {
    // Attach each selected genre to the movie
    let ok = 0, fail = 0;
    for (const genreId of genreIds) {
        try {
            const r = await fetch(`http://localhost:3001/api/movie/${movieId}/genres`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify({ genre_id: genreId })
            });
            if (r.ok) ok++; else fail++;
        } catch {
            fail++;
        }
    }
    return { ok, fail };
}

// Handle form submit to add a movie
document.getElementById('add-movie-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const mpaRatingInput = document.querySelector('.mpa-checkbox:checked');
    const mpa_rating = mpaRatingInput ? mpaRatingInput.value : '';
    const name = document.getElementById('name').value.trim();
    const year = parseInt(document.getElementById('year').value, 10);
    const description = document.getElementById('description').value.trim();
    const price = parseInt(document.getElementById('price').value, 10);
    const stock = parseInt(document.getElementById('stock').value, 10);
    const duration = parseInt(document.getElementById('duration').value, 10);
    const director = document.getElementById('director').value.trim();
    const film_studio_id = parseInt(document.getElementById('film_studio_id').value, 10);
    const image_path = document.getElementById('image_path').value.trim();
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    const message = document.getElementById('message');
    message.textContent = '';
    message.className = 'font-body text-center mt-2';

    // Collect selected genres (now using genre IDs)
    const genreIds = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(cb => parseInt(cb.value));
    
    // Basic validation
    if (!mpa_rating) {
        message.textContent = "Please select an MPA rating.";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    }
    if (!film_studio_id) {
        message.textContent = "Please select a film studio.";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    }
    if (genreIds.length === 0) {
        document.getElementById('genres-error').classList.remove('hidden');
        message.textContent = "Please select at least one genre.";
        message.className = "font-body text-center mt-2 text-red-500";
        return;
    } else {
        document.getElementById('genres-error').classList.add('hidden');
    }

    try {
        // Create movie without genre field
        const res = await fetch('http://localhost:3001/api/movies', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify({
                name,
                year,
                description,
                price,
                stock,
                duration,
                mpa_rating,
                director,
                film_studio_id,
                image_path
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            message.textContent = "Error adding movie: " + (errorText || res.statusText);
            message.className = "font-body text-center mt-2 text-red-500";
            return;
        }

        const created = await res.json();
        const movieId = created?.id || created?.movie?.id;
        if (!movieId) {
            message.textContent = "Movie created but ID was not returned.";
            message.className = "font-body text-center mt-2 text-yellow-600";
            return;
        }

        // Attach all selected genres via join table
        const { ok, fail } = await addGenresToMovie(movieId, genreIds, token);

        let finalMsg = "Movie added successfully!";
        if (ok > 0) finalMsg += ` ${ok} genre(s) linked.`;
        if (fail > 0) finalMsg += ` ${fail} genre(s) failed.`;
        message.textContent = finalMsg;
        message.className = fail === 0
            ? "font-body text-center mt-2 text-green-600"
            : "font-body text-center mt-2 text-yellow-600";

        // Reset form
        this.reset();
        document.querySelectorAll('.mpa-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.genre-checkbox').forEach(cb => cb.checked = false);
    } catch (err) {
        message.textContent = "Error adding movie: " + err.message;
        message.className = "font-body text-center mt-2 text-red-500";
    }
});

// Initial load
loadStudios();
loadGenres();
