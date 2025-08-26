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
async function addOneMovie(name, year, description, price, stock, duration, mpa_rating, genre, country, director, film_studio_id, image_path) {
    const res = await dbClient.query(`INSERT INTO movies (name, year, description, price, stock, duration, mpa_rating, genre, country, director, film_studio_id, image_path) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, [name, year, description, price, stock, duration, mpa_rating, genre, country, director, film_studio_id, image_path]);
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
async function updateOneMovie(id, name, year, description, price, stock, duration, mpa_rating, genre, country, director, film_studio_id, image_path) {
    const res = await dbClient.query(`UPDATE movies SET name = $2, year = $3, description = $4, price = $5, stock = $6, duration = $7, mpa_rating = $8, genre = $9, country = $10, director = $11, film_studio_id = $12, image_path = $13 WHERE id = $1 RETURNING *`, [id, name, year, description, price, stock, duration, mpa_rating, genre, country, director, film_studio_id, image_path]);
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
    addUser,
    getUserByEmail
};
