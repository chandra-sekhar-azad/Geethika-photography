import express from 'express';
import pool from '../config/database.js';
import { authenticate, isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get audit logs (Super Admin only)
router.get('/logs', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      adminId, 
      entityType, 
      action,
      startDate,
      endDate 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (adminId) {
      whereConditions.push(`admin_id = $${paramCount}`);
      queryParams.push(adminId);
      paramCount++;
    }

    if (entityType) {
      whereConditions.push(`entity_type = $${paramCount}`);
      queryParams.push(entityType);
      paramCount++;
    }

    if (action) {
      whereConditions.push(`action = $${paramCount}`);
      queryParams.push(action);
      paramCount++;
    }

    if (startDate) {
      whereConditions.push(`created_at >= $${paramCount}`);
      queryParams.push(startDate);
      paramCount++;
    }

    if (endDate) {
      whereConditions.push(`created_at <= $${paramCount}`);
      queryParams.push(endDate);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM audit_logs ${whereClause}`,
      queryParams
    );
    const totalLogs = parseInt(countResult.rows[0].count);

    // Get logs
    const logsResult = await pool.query(
      `SELECT * FROM audit_logs 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...queryParams, limit, offset]
    );

    res.json({
      logs: logsResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

// Get audit log statistics (Super Admin only)
router.get('/stats', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    let queryParams = [];
    
    if (startDate && endDate) {
      dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
      queryParams = [startDate, endDate];
    }

    // Get action counts
    const actionStats = await pool.query(
      `SELECT action, COUNT(*) as count 
       FROM audit_logs ${dateFilter}
       GROUP BY action 
       ORDER BY count DESC`,
      queryParams
    );

    // Get entity type counts
    const entityStats = await pool.query(
      `SELECT entity_type, COUNT(*) as count 
       FROM audit_logs ${dateFilter}
       GROUP BY entity_type 
       ORDER BY count DESC`,
      queryParams
    );

    // Get admin activity
    const adminStats = await pool.query(
      `SELECT admin_id, admin_email, admin_name, COUNT(*) as action_count 
       FROM audit_logs ${dateFilter}
       GROUP BY admin_id, admin_email, admin_name 
       ORDER BY action_count DESC 
       LIMIT 10`,
      queryParams
    );

    // Get recent activity count
    const recentActivity = await pool.query(
      `SELECT COUNT(*) as count 
       FROM audit_logs 
       WHERE created_at >= NOW() - INTERVAL '24 hours'`
    );

    res.json({
      actionStats: actionStats.rows,
      entityStats: entityStats.rows,
      adminStats: adminStats.rows,
      recentActivity: parseInt(recentActivity.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ message: 'Error fetching audit statistics' });
  }
});

// Get specific admin's activity (Super Admin only)
router.get('/admin/:adminId', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM audit_logs 
       WHERE admin_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [adminId, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM audit_logs WHERE admin_id = $1`,
      [adminId]
    );

    res.json({
      logs: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(countResult.rows[0].count / limit),
        totalLogs: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    res.status(500).json({ message: 'Error fetching admin activity' });
  }
});

export default router;
