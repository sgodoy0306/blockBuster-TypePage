const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../scripts/blockBuster");

const SECRET_KEY = process.env.JWT_SECRET;
const USER_FIELDS = ["username", "email", "password"];

function validateUserFields(body) {
  return USER_FIELDS.every((field) => body[field]);
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

function handleWrongPassword(res) {
  console.log('Error: Wrong password');
  return res.status(400).json({error:'Wrong password'});
}

const register = async (req, res) => {
  const { username, email, password, is_admin } = req.body;
  if (!validateUserFields(req.body)) {
    return handleMissingFields(res);
  }
  
  const existingUsername = await db.getUserByUsername(username);
  const existingEmail = await db.getUserByEmail(email);
  if (existingUsername) {
    return res.status(400).json({error:'This Username is already registered'});
  }
  if (existingEmail) {
    return res.status(400).json({error:'This email is already registered'});
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.addUser(username, email, hashedPassword, is_admin);

  if (!user) {
    return handleCouldNotBeAdded(res, "User");
  }

  res.json(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleMissingFields(res);
  }
  
  const user = await db.getUserByEmail(email);

  if (!user) {
    return handleNotFound(res, "User");
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!validPassword) {
    return handleWrongPassword(res);
  }

  const token = jwt.sign(
    {id: user.id, email: user.email, username: user.username, is_admin: user.is_admin},
    SECRET_KEY, 
    { expiresIn:"1h" }
  );

  res.json({
    message: 'Login Successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin
    }
  });
};

const getUserInfo = async (req, res) => {
  try{
    console.log("Decoded token:", req.user)
    const email = req.user.email;
    const user = await db.getUserByEmail(email);

    if(!user) {
      return handleNotFound(res, "User");
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin
    });
  } catch(err) {
    res.status(500).json({ error: 'Server error'});
  }
}

// Get all reservations for a user
const getUserReservations = async (req, res) => {
  const userId = req.params.id;
  // Only allow user to see their own reservations or admin
  if (parseInt(userId) !== req.user.id && !req.user.is_admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const dbClient = require('../scripts/blockBuster');
    const result = await dbClient.query(
      `SELECT r.id AS reservation_id, r.reserved_at, m.* FROM reservations r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = $1
       ORDER BY r.reserved_at DESC`,
      [userId]
    );
    // Format response: { id: reservation_id, reserved_at, movie: {...} }
    const reservations = result.rows.map(row => ({
      id: row.reservation_id, // always reservation id
      reserved_at: row.reserved_at,
      movie: {
        id: row.id, // movie id
        name: row.name,
        year: row.year,
        description: row.description,
        price: row.price,
        stock: row.stock,
        duration: row.duration,
        mpa_rating: row.mpa_rating,
        director: row.director,
        film_studio_id: row.film_studio_id,
        image_path: row.image_path
      }
    }));
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  getUserReservations
};
