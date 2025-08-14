const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = "/api";
const MOVIE_FIELDS = [
  "name",
  "year",
  "description",
  "price",
  "stock",
  "duration",
  "mpa_rating",
  "genre",
  "country",
  "director",
  "film_studio_id",
  "image_path",
];

const STUDIO_FIELDS = ["name", "description", "year_creation", "founder"];

app.use(express.json());
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
// Importing functions from blockBuster.js
const {
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
  deleteOneActor,
  updateOneActor,
  getActorsByMovieId,
  getMoviesByActorId,
  addActorToMovie,
  removeActorFromMovie
} = require("./scripts/blockBuster.js");

// functions to validate fields and extract data from request bodies
function validateMovieFields(body) {
  return MOVIE_FIELDS.every((field) => body[field]);
}

function validateStudioFields(body) {
  return STUDIO_FIELDS.every((field) => body[field]);
}

function extractMovieFieldsArray(body) {
  return MOVIE_FIELDS.map((field) => body[field]);
}

function extractStudioFieldsArray(body) {
  return STUDIO_FIELDS.map((field) => body[field]);
}
// functions to handle errors and responses
function handleNotFound(res, itemName) {
  console.log(`Error: ${itemName} not found`);
  return res.sendStatus(404);
}
function handleMissingFields(res) {
  console.log("Error: Missing required fields");
  return res.status(400).json({ error: "Missing required fields" });
}
function handleCouldNotBeAdded(res, itemName) {
  console.log(`Error: ${itemName} could not be added`);
  return res.status(500).json({ error: `${itemName} could not be added` });
}

// Health route

app.get(`${API_BASE_URL}/health`, (req, res) => {
  res.json({
    status: "OK",
  });
});

// See all movies from the database

app.get(`${API_BASE_URL}/movies`, async (req, res) => {
  const movies = await getAllMovies();
  res.json(movies);
});

// See one movie from the database

app.get(`${API_BASE_URL}/movie/:id`, async (req, res) => {
  const movie = await getOneMovie(req.params.id);
  if (!movie) {
    return handleNotFound(res, "Movie");
  }
  res.json(movie);
});

// Add a new movie to the database

app.post(`${API_BASE_URL}/movies`, async (req, res) => {
  if (!validateMovieFields(req.body)) {
    return handleMissingFields(res);
  }
  const movie = await addOneMovie(...extractMovieFieldsArray(req.body));
  if (!movie) {
    return handleCouldNotBeAdded(res, "Movie");
  }
  res.json(movie);
});

// Delete one movie from the database
app.delete(`${API_BASE_URL}/movie/:id`, async (req, res) => {
  const movie = await deleteOneMovie(req.params.id);

  if (!movie) {
    return handleNotFound(res, "Movie");
  }
  res.json(movie);
});

// Update one movie in the database
app.put(`${API_BASE_URL}/movie/:id`, async (req, res) => {
  if (!validateMovieFields(req.body)) {
    return handleMissingFields(res);
  }
  const movie = await updateOneMovie(
    req.params.id,
    ...extractMovieFieldsArray(req.body)
  );
  if (!movie) {
    return handleNotFound(res, "Movie");
  }
  res.json(movie);
});

// See all film studios from the database
app.get(`${API_BASE_URL}/film_studios`, async (req, res) => {
  const studios = await getAllStudios();
  res.json(studios);
});

// See one film studio from the database
app.get(`${API_BASE_URL}/film_studio/:id`, async (req, res) => {
  const studio = await getOneStudio(req.params.id);
  if (!studio) {
    return handleNotFound(res, "Film Studio");
  }
  return res.json(studio);
});

// Add a new film studio to the database
app.post(`${API_BASE_URL}/film_studios`, async (req, res) => {
  if (!validateStudioFields(req.body)) {
    return handleMissingFields(res);
  }
  const studio = await addOneStudio(...extractStudioFieldsArray(req.body));

  if (!studio) {
    return handleCouldNotBeAdded(res, "Film Studio");
  }

  res.json(studio);
});

// Delete one film studio from the database
app.delete(`${API_BASE_URL}/film_studio/:id`, async (req, res) => {
  const studio = await deleteOneStudio(req.params.id);

  if (!studio) {
    return handleNotFound(res, "Film Studio");
  }

  res.json(studio);
});

// Update one film studio in the database
app.put(`${API_BASE_URL}/film_studio/:id`, async (req, res) => {
  if (!validateStudioFields(req.body)) {
    return handleMissingFields(res);
  }

  const studio = await updateOneStudio(
    req.params.id,
    ...extractStudioFieldsArray(req.body)
  );

  if (!studio) {
    return handleNotFound(res, "Film Studio");
  }

  res.json(studio);
});

// See all actors from the database
app.get(`${API_BASE_URL}/actors`, async (req, res) => {
  const actors = await getAllActors();
  res.json(actors);
});

// See one actor from the database
app.get(`${API_BASE_URL}/actor/:id`, async (req, res) => {
  const actor = await getOneActor(req.params.id);
  if (!actor) {
    return handleNotFound(res, "Actor");
  }
  res.json(actor);
});

// Add one actor to the database
app.post(`${API_BASE_URL}/actors`, async (req, res) => {
  if (!req.body.name) {
    return handleMissingFields(res);
  }
  const actor = await addOneActor(req.body.name);
  if (!actor) {
    return handleCouldNotBeAdded(res, "Actor");
  }
  res.json(actor);
});

// Delete one actor from the database
app.delete(`${API_BASE_URL}/actor/:id`, async (req, res) => {
  const actor = await deleteOneActor(req.params.id);

  if (!actor) {
    return handleNotFound(res, "Actor");
  }

  res.json(actor);
});

// Update one actor in the database
app.put(`${API_BASE_URL}/actor/:id`, async (req, res) => {
  if (!req.body.name) {
    return handleMissingFields(res);
  }
  const actor = await updateOneActor(req.params.id, req.body.name);

  if (!actor) {
    return handleNotFound(res, "Actor");
  }

  res.json(actor);
});

// Get all actors for a specific movie
app.get(`${API_BASE_URL}/movie/:id/actors`, async (req, res) => {
  const actors = await getActorsByMovieId(req.params.id);
  if (actors === null) {
    return handleNotFound(res, "Movie");
  }
  res.json(actors);
});

// Get all movies for a specific actor
app.get(`${API_BASE_URL}/actor/:id/movies`, async (req, res) => {
  const movies = await getMoviesByActorId(req.params.id);
  if (movies === null) {
    return handleNotFound(res, "Actor");
  }
  res.json(movies);
});

// Add an actor to a specific movie
app.post(`${API_BASE_URL}/movie/:id/actors`, async (req, res) => {
  if (!req.body.actor_id) {
    return handleMissingFields(res);
  }
  const result = await addActorToMovie(req.params.id, req.body.actor_id);
  if (!result) {
    return handleCouldNotBeAdded(res, "Actor to Movie");
  }
  res.json(result);
});

// Remove an actor from a specific movie
app.delete(`${API_BASE_URL}/movie/:id/actor/:actorId`, async (req, res) => {
  const result = await removeActorFromMovie(req.params.id, req.params.actorId);
  if (!result) {
    return handleNotFound(res, "Actor in Movie");
  }
  res.json(result);
});