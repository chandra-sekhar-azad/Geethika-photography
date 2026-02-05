import pool from '../config/database.js';

// Middleware to log admin actions
const logAdminAction = async (req, action, entityType, entityId, entityName, changes = null) => {
  try {
    const adminId = req.user?.id;
    const adminEmail = req.user?.email;
    const adminName = req.user?.name;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    await pool.query(
      `INSERT INTO audit_logs 
       (admin_id, admin_email, admin_name, action, entity_type, entity_id, entity_name, changes, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [adminId, adminEmail, adminName, action, entityType, entityId, entityName, changes ? JSON.stringify(changes) : null, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw error to prevent breaking the main operation
  }
};

// Helper function to compare objects and get changes
const getChanges = (oldData, newData) => {
  const changes = {
    before: {},
    after: {}
  };

  const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
  
  allKeys.forEach(key => {
    if (JSON.stringify(oldData?.[key]) !== JSON.stringify(newData?.[key])) {
      changes.before[key] = oldData?.[key];
      changes.after[key] = newData?.[key];
    }
  });

  return Object.keys(changes.before).length > 0 ? changes : null;
};

export { logAdminAction, getChanges };
