const db = require("../scripts/blockBuster");

const MOVIE_FIELDS = [
  "name", "year", "description", "price", "stock", "duration",
  "mpa_rating", "genre", "director", "film_studio_id", "image_path",
];

function validateMovieFields(body) {
  return MOVIE_FIELDS.every((field) => body[field]);
}

function extractMovieFieldsArray(body) {
  return MOVIE_FIELDS.map((field) => body[field]);
}

function handleNotFound(res, itemName) {
  console.log(`Error: ${itemName} not found`);
  return res.status(404).json({error: `${itemName} not found`});
}

function handleMissingFields(res) {
  console.log("Error: Missing required fields");
  return res.status(400).json({ error: "Missing required fields" });
}

function handleCouldNotBeAdded(res, itemName) {
  console.log(`Error: ${itemName} could not be added`);
  return res.status(500).json({ error: `${itemName} could not be added` });
}

const getAllMovies = async (req, res) => {
  const movies = await db.getAllMovies();
  res.json(movies);
};

const getOneMovie = async (req, res) => {
  const movie = await db.getOneMovie(req.params.id);
  if (!movie) {
    return handleNotFound(res, "Movie");
  }
  res.json(movie);
};

const addOneMovie = async (req, res) => {
  if (!validateMovieFields(req.body)) {
    return handleMissingFields(res);
  }
  const movie = await db.addOneMovie(...extractMovieFieldsArray(req.body));
  if (!movie) {
    return handleCouldNotBeAdded(res, "Movie");
  }
  res.json(movie);
};

const deleteOneMovie = async (req, res) => {
  const movie = await db.deleteOneMovie(req.params.id);
  if (!movie) {
    return handleNotFound(res, "Movie");
  }
  res.json(movie);
};

const updateOneMovie = async (req, res) => {
  if (!validateMovieFields(req.body)) {
    return handleMissingFields(res);
  }
  const movie = await db.updateOneMovie(req.params.id, ...extractMovieFieldsArray(req.body));
  if (!movie) {
    return handleNotFound(res, "Movie");
  }
  res.json(movie);
};

const getActorsByMovieId = async (req, res) => {
  const actors = await db.getActorsByMovieId(req.params.id);
  if (actors === null) {
    return handleNotFound(res, "Movie");
  }
  res.json(actors);
};

const addActorToMovie = async (req, res) => {
  if (!req.body.actor_id) {
    return handleMissingFields(res);
  }
  const result = await db.addActorToMovie(req.params.id, req.body.actor_id);
  if (!result) {
    return handleCouldNotBeAdded(res, "Actor to Movie");
  }
  res.json(result);
};

const removeActorFromMovie = async (req, res) => {
  const result = await db.removeActorFromMovie(req.params.id, req.params.actorId);
  if (!result) {
    return handleNotFound(res, "Actor in Movie");
  }
  res.json(result);
};

module.exports = {
  getAllMovies,
  getOneMovie,
  addOneMovie,
  deleteOneMovie,
  updateOneMovie,
  getActorsByMovieId,
  addActorToMovie,
  removeActorFromMovie
};
