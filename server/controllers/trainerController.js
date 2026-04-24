import pool from '../config/db.js';

export const getTrainers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, l.name as location_name 
      FROM trainers t 
      LEFT JOIN gym_locations l ON t.location_id = l.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trainers', error: err.message });
  }
};

export const createTrainer = async (req, res) => {
  const { name, specialization, phone, location_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO trainers (name, specialization, phone, location_id) VALUES (?, ?, ?, ?)',
      [name, specialization, phone, location_id]
    );
    res.status(201).json({ message: 'Trainer created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating trainer', error: err.message });
  }
};
