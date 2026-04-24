import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Members
    const [memberCount] = await pool.query('SELECT COUNT(*) as count FROM members');
    
    // 2. Active Memberships
    const [activeCount] = await pool.query("SELECT COUNT(*) as count FROM memberships WHERE status = 'active'");
    
    // 3. Total Revenue
    const [revenue] = await pool.query('SELECT SUM(amount) as total FROM payments');
    
    // 4. Monthly Revenue (Last 6 months) for Chart
    const [monthlyRevenue] = await pool.query(`
      SELECT DATE_FORMAT(payment_date, '%b') as month, SUM(amount) as total 
      FROM payments 
      GROUP BY month 
      ORDER BY payment_date DESC 
      LIMIT 6
    `);

    // 5. Recent Members
    const [recentMembers] = await pool.query(`
      SELECT full_name, created_at 
      FROM members 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // 6. Expiring Soon (Next 7 days)
    const [expiringSoon] = await pool.query(`
      SELECT m.full_name, ms.end_date, m.phone 
      FROM memberships ms
      JOIN members m ON ms.member_id = m.id
      WHERE ms.end_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) 
      AND ms.end_date >= CURDATE()
      AND ms.status = 'active'
    `);

    res.json({
      totalMembers: memberCount[0].count,
      activeMemberships: activeCount[0].count,
      totalRevenue: revenue[0].total || 0,
      monthlyRevenue: monthlyRevenue.reverse(),
      recentMembers,
      expiringSoon
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};
