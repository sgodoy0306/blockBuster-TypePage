const db = require("../scripts/blockBuster");

const STUDIO_FIELDS = ["name", "description", "year_creation", "founder"];

function validateStudioFields(body) {
  return STUDIO_FIELDS.every((field) => body[field]);
}

function extractStudioFieldsArray(body) {
  return STUDIO_FIELDS.map((field) => body[field]);
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

const getAllStudios = async (req, res) => {
  const studios = await db.getAllStudios();
  res.json(studios);
};

const getOneStudio = async (req, res) => {
  const studio = await db.getOneStudio(req.params.id);
  if (!studio) {
    return handleNotFound(res, "Film Studio");
  }
  res.json(studio);
};

const addOneStudio = async (req, res) => {
  if (!validateStudioFields(req.body)) {
    return handleMissingFields(res);
  }
  const studio = await db.addOneStudio(...extractStudioFieldsArray(req.body));
  if (!studio) {
    return handleCouldNotBeAdded(res, "Film Studio");
  }
  res.json(studio);
};

const deleteOneStudio = async (req, res) => {
  const studio = await db.deleteOneStudio(req.params.id);
  if (!studio) {
    return handleNotFound(res, "Film Studio");
  }
  res.json(studio);
};

const updateOneStudio = async (req, res) => {
  if (!validateStudioFields(req.body)) {
    return handleMissingFields(res);
  }
  const studio = await db.updateOneStudio(req.params.id, ...extractStudioFieldsArray(req.body));
  if (!studio) {
    return handleNotFound(res, "Film Studio");
  }
  res.json(studio);
};

module.exports = {
  getAllStudios,
  getOneStudio,
  addOneStudio,
  deleteOneStudio,
  updateOneStudio
};
