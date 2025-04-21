import { Router } from 'express';
import { Activity } from '../models/Activity';
import { auth } from '../middleware/auth';

const router = Router();

// Get user's recent activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Create a new activity
router.post('/', auth, async (req, res) => {
  try {
    const { type, description, linkId, folderId } = req.body;
    const activity = new Activity({
      userId: req.user.id,
      type,
      description,
      linkId,
      folderId
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Error creating activity' });
  }
});

export default router; 