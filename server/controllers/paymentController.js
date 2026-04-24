import pool from '../config/db.js';

export const getPayments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, m.full_name as member_name, pl.plan_name 
      FROM payments p
      JOIN memberships ms ON p.membership_id = ms.id
      JOIN members m ON ms.member_id = m.id
      JOIN plans pl ON ms.plan_id = pl.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
};

export const createPayment = async (req, res) => {
  const { member_id, plan_id, amount, payment_method } = req.body;
  
  try {
    // 1. Get plan duration
    const [plans] = await pool.query('SELECT duration_months FROM plans WHERE id = ?', [plan_id]);
    if (plans.length === 0) return res.status(404).json({ message: 'Plan not found' });
    
    const duration = plans[0].duration_months;
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);
    const endDateStr = endDate.toISOString().split('T')[0];

    // 2. Create Membership Record
    const [membership] = await pool.query(
      'INSERT INTO memberships (member_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, "active")',
      [member_id, plan_id, startDate, endDateStr]
    );

    // 3. Record Payment
    await pool.query(
      'INSERT INTO payments (membership_id, amount, payment_method) VALUES (?, ?, ?)',
      [membership.insertId, amount, payment_method]
    );

    res.status(201).json({ message: 'Payment recorded and membership activated' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
};
