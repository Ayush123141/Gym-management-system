import pool from '../config/db.js';

export const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gym_locations');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations', error: err.message });
  }
};

export const createLocation = async (req, res) => {
  const { name, address, contact_number } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO gym_locations (name, address, contact_number) VALUES (?, ?, ?)',
      [name, address, contact_number]
    );
    res.status(201).json({ message: 'Location created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating location', error: err.message });
  }
};
