const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const role = req.header('x-user-role') || 'employee';
    const userId = req.employee?.id || req.admin?.id;
    
    const notifications = await Notification.find({
      recipientId: userId,
      recipientType: role === 'admin' ? 'Admin' : 'Employee'
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const role = req.header('x-user-role') || 'employee';
    const userId = req.employee?.id || req.admin?.id;
    
    const count = await Notification.countDocuments({
      recipientId: userId,
      recipientType: role === 'admin' ? 'Admin' : 'Employee',
      isRead: false
    });
    
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark all as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const role = req.header('x-user-role') || 'employee';
    const userId = req.employee?.id || req.admin?.id;
    
    await Notification.updateMany(
      {
        recipientId: userId,
        recipientType: role === 'admin' ? 'Admin' : 'Employee',
        isRead: false
      },
      { isRead: true }
    );
    
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to create notification (exported for use in other routes)
const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

module.exports = router;
module.exports.createNotification = createNotification;
