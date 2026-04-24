import pool from '../config/db.js';

export const getMembers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, l.name as location_name 
      FROM members m 
      LEFT JOIN gym_locations l ON m.location_id = l.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching members', error: err.message });
  }
};

export const createMember = async (req, res) => {
  const { full_name, email, phone, address, gender, dob, location_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO members (full_name, email, phone, address, gender, dob, location_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, address, gender, dob, location_id]
    );
    res.status(201).json({ message: 'Member created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating member', error: err.message });
  }
};

export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, address, gender, status, version } = req.body;
  try {
    // Optimistic Concurrency Control: Check if version matches
    const [result] = await pool.query(
      'UPDATE members SET full_name=?, email=?, phone=?, address=?, gender=?, status=?, version = version + 1 WHERE id=? AND version=?',
      [full_name, email, phone, address, gender, status, id, version]
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({ 
        message: 'Concurrency Error: This member has been updated by another user. Please refresh and try again.' 
      });
    }

    res.json({ message: 'Member updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating member', error: err.message });
  }
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM members WHERE id = ?', [id]);
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting member', error: err.message });
  }
};
