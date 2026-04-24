import pool from '../config/db.js';

export const getPlans = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM plans');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching plans', error: err.message });
  }
};

export const createPlan = async (req, res) => {
  const { plan_name, duration_months, price, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO plans (plan_name, duration_months, price, description) VALUES (?, ?, ?, ?)',
      [plan_name, duration_months, price, description]
    );
    res.status(201).json({ message: 'Plan created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating plan', error: err.message });
  }
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM plans WHERE id = ?', [id]);
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting plan', error: err.message });
  }
};
