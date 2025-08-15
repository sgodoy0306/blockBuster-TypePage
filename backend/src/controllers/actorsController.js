const db = require("../scripts/blockBuster");

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

const getAllActors = async (req, res) => {
  const actors = await db.getAllActors();
  res.json(actors);
};

const getOneActor = async (req, res) => {
  const actor = await db.getOneActor(req.params.id);
  if (!actor) {
    return handleNotFound(res, "Actor");
  }
  res.json(actor);
};

const addOneActor = async (req, res) => {
  if (!req.body.name) {
    return handleMissingFields(res);
  }
  const actor = await db.addOneActor(req.body.name);
  if (!actor) {
    return handleCouldNotBeAdded(res, "Actor");
  }
  res.json(actor);
};

const deleteOneActor = async (req, res) => {
  const actor = await db.deleteOneActor(req.params.id);
  if (!actor) {
    return handleNotFound(res, "Actor");
  }
  res.json(actor);
};

const updateOneActor = async (req, res) => {
  if (!req.body.name) {
    return handleMissingFields(res);
  }
  const actor = await db.updateOneActor(req.params.id, req.body.name);
  if (!actor) {
    return handleNotFound(res, "Actor");
  }
  res.json(actor);
};

const getMoviesByActorId = async (req, res) => {
  const movies = await db.getMoviesByActorId(req.params.id);
  if (movies === null) {
    return handleNotFound(res, "Actor");
  }
  res.json(movies);
};

module.exports = {
  getAllActors,
  getOneActor,
  addOneActor,
  deleteOneActor,
  updateOneActor,
  getMoviesByActorId
};
