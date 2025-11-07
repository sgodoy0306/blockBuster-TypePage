
const { Pool } = require("pg");

const dbClient = new Pool ({
    user: 'postgres',
    port: 5432,
    host: 'localhost',
    database: 'blockbuster',
    password: 'postgres',
});

// View all movies
async function getAllMovies() {
    const res = await dbClient.query(`SELECT * FROM movies`);
    return res.rows;
};

// View one movie
async function getOneMovie(id) {
    const res = await dbClient.query(`SELECT * from movies WHERE id = $1`, [id]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
};

// Add one movie
async function addOneMovie(name, year, description, price, stock, duration, mpa_rating, director, film_studio_id, image_path) {
    const res = await dbClient.query(`INSERT INTO movies (name, year, description, price, stock, duration, mpa_rating, director, film_studio_id, image_path) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [name, year, description, price, stock, duration, mpa_rating, director, film_studio_id, image_path]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
};

// Delete one movie
async function deleteOneMovie(id) {
    const res = await dbClient.query(`DELETE FROM movies WHERE id = $1 RETURNING *`, [id])
    if(res.rowCount === 0){
        return undefined;
    }
    return res.rows[0];
};

// Update one movie
async function updateOneMovie(id, name, year, description, price, stock, duration, mpa_rating, director, film_studio_id, image_path) {
    const res = await dbClient.query(`UPDATE movies SET name = $2, year = $3, description = $4, price = $5, stock = $6, duration = $7, mpa_rating = $8, director = $9, film_studio_id = $10, image_path = $11 WHERE id = $1 RETURNING *`, [id, name, year, description, price, stock, duration, mpa_rating, director, film_studio_id, image_path]);
    if(res.rowCount === 0){
        return undefined;
    }
    return res.rows[0];
};

// View all studios
async function getAllStudios() {
    const res = await dbClient.query(`SELECT * FROM film_studios`);
    return res.rows;
};

// View one studio
async function getOneStudio(id) {
    const res = await dbClient.query(`SELECT * FROM film_studios WHERE id = $1`, [id]);
    if(res.rowCount === 0){
        return undefined;
    }
    return res.rows[0];
};

// Add one studio
async function addOneStudio(name, description, year_creation, founder){
    const res = await dbClient.query(`INSERT INTO film_studios (name, description, year_creation, founder) VALUES ($1, $2, $3, $4) RETURNING *`, [name, description, year_creation, founder]);
    if (res.rowCount === 0) {
        return undefined;
    };
    return res.rows[0];
};

// Delete one studio
async function deleteOneStudio(id){
    const res = await dbClient.query(`DELETE FROM film_studios where id = $1 returning *`, [id]);
    if(res.rowCount === 0) {
        return undefined;
    };
    return res.rows[0];
};

// Update one studio
async function updateOneStudio(id, name, description, year_creation, founder){
    const res = await dbClient.query(`UPDATE film_studios SET name = $2, description = $3, year_creation = $4, founder = $5 WHERE id = $1 RETURNING *`, [id, name, description, year_creation, founder]);
    if (res.rowCount === 0){
        return undefined;
    };

    return res.rows[0];
};

// View all actors
async function getAllActors(){
    const res = await dbClient.query(`SELECT * FROM actors`);
    return res.rows;
};

// View one actor
async function getOneActor(id){
    const res = await dbClient.query(`SELECT * FROM actors WHERE id = $1`, [id]);

    if(res.rowCount === 0){
        return undefined;
    };

    return res.rows[0];
};

// Add one actor
async function addOneActor(name){
    const res = await dbClient.query(`INSERT INTO actors (name) VALUES ($1) RETURNING *`, [name]);

    if(res.rowCount === 0){
        return undefined;
    };

    return res.rows[0];

};

// Delete one actor
async function deleteOneActor(id){
    const res = await dbClient.query(`DELETE FROM actors WHERE id = $1 RETURNING *`, [id]);

    if(res.rowCount === 0){
        return undefined;
    };

    return res.rows[0];

};

// Update one actor
async function updateOneActor(id, name){
    const res = await dbClient.query(`UPDATE actors SET name = $2 WHERE id = $1 RETURNING *`, [id, name]);

    if(res.rowCount === 0){
        return undefined;
    };

    return res.rows[0];

};

// Get actors by movie ID
async function getActorsByMovieId(movieId) {
    const res = await dbClient.query(`SELECT a.* FROM actors a
    JOIN actors_in_movies aim ON a.id = aim.actor_id
    WHERE aim.movie_id = $1`, [movieId]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows;
};

// Get movies by actor ID
async function getMoviesByActorId(actorId) {
    const res = await dbClient.query(`SELECT m.* FROM movies m
    JOIN actors_in_movies aim ON m.id = aim.movie_id
    WHERE aim.actor_id = $1`, [actorId]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows;
};

// Add an actor to a specific movie
async function addActorToMovie(movieId, actorId) {
    const res = await dbClient.query(`INSERT INTO actors_in_movies (movie_id, actor_id) VALUES ($1, $2) RETURNING *`, [movieId, actorId]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
};  

// Remove an actor from a specific movie
async function removeActorFromMovie(movieId, actorId) {
    const res = await dbClient.query(`DELETE FROM actors_in_movies WHERE movie_id = $1 AND actor_id = $2 RETURNING *`, [movieId, actorId]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
};

// Add an genre to a specific movie
async function addGenreToMovie(movieId, genreId) {
    const res = await dbClient.query(`INSERT INTO genres_in_movies (movie_id, genre_id) VALUES ($1, $2) RETURNING *`, [movieId, genreId]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
};  

// Remove an genre from a specific movie
async function removeGenreFromMovie(movieId, genreId) {
    const res = await dbClient.query(`DELETE FROM genres_in_movies WHERE movie_id = $1 AND genre_id = $2 RETURNING *`, [movieId, genreId]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
};

// View all genres
async function getAllGenres() {
    const res = await dbClient.query(`SELECT * FROM genres ORDER BY name`);
    return res.rows;
};

// Get genres by movie ID
async function getGenresByMovieId(movieId) {
    const res = await dbClient.query(`SELECT g.* FROM genres g
    JOIN genres_in_movies gim ON g.id = gim.genre_id
    WHERE gim.movie_id = $1`, [movieId]);
    return res.rows;
};

// Add a new user 

async function addUser(username, email, password_hash, is_admin = false){
    const res = await dbClient.query(`INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING *`, [username, email, password_hash, is_admin]);
    return res.rows[0];
}



//  View user by email

async function getUserByEmail(email) {
    const res = await dbClient.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
}
async function getUserByUsername(username) {
    const res = await dbClient.query(`SELECT * FROM users WHERE username = $1`, [username]);
    if (res.rowCount === 0) {
        return undefined;
    }
    return res.rows[0];
}

// Reserve movie: decrease stock and save reservation
async function reserveMovie(userId, movieId) {
    // Baja el stock si hay disponible y guarda la reserva
    const client = await dbClient.connect();
    try {
        await client.query('BEGIN');
        // Verificar stock
        const resMovie = await client.query('SELECT stock FROM movies WHERE id = $1 FOR UPDATE', [movieId]);
        if (resMovie.rowCount === 0) throw new Error('Movie not found');
        const stock = resMovie.rows[0].stock;
        if (stock <= 0) throw new Error('No stock available');
        // Bajar stock
        await client.query('UPDATE movies SET stock = stock - 1 WHERE id = $1', [movieId]);
        // Guardar reserva
        await client.query('INSERT INTO reservations (user_id, movie_id) VALUES ($1, $2)', [userId, movieId]);
        await client.query('COMMIT');
        return true;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    getAllMovies,
    getOneMovie,
    addOneMovie,
    deleteOneMovie,
    updateOneMovie,
    getAllStudios,
    getOneStudio,
    addOneStudio,
    deleteOneStudio,
    updateOneStudio,
    getAllActors,
    getOneActor,
    addOneActor,
    updateOneActor,
    deleteOneActor,
    getActorsByMovieId,
    getMoviesByActorId,
    addActorToMovie,
    removeActorFromMovie,
    getAllGenres,
    getGenresByMovieId,
    addGenreToMovie,
    removeGenreFromMovie,
    addUser,
    getUserByEmail,
    getUserByUsername,
    reserveMovie,
    query: dbClient.query.bind(dbClient)
};
