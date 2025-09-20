// controllers/instructorSettings.controller.js
const InstructorSettings = require('../models/instructorsSettings.model');
const User = require('../models/user.model');

// GET instructor settings
exports.getInstructorSettings = async (req, res) => {
  try {
    const instructorId = req.user._id;

    let settings = await InstructorSettings.findOne({ instructor: instructorId });
    if (!settings) {
      // Create default settings if none exist
      settings = await InstructorSettings.create({ instructor: instructorId });
    }

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get settings' });
  }
};

// UPDATE instructor settings
exports.updateInstructorSettings = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { emailNotifications, courseEnrollments, newMessages } = req.body;

    const updatedSettings = await InstructorSettings.findOneAndUpdate(
      { instructor: instructorId },
      {
        $set: {
          ...(emailNotifications !== undefined && { emailNotifications }),
          ...(courseEnrollments !== undefined && { courseEnrollments }),
          ...(newMessages !== undefined && { newMessages }),
        },
      },
      { new: true, upsert: true } // create if not exists
    );

    res.json(updatedSettings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};
