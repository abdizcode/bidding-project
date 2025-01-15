const express = require("express");
const {getNotifications, getNotificationByUser} = require("../controllers/notificationController");
const router = express.Router();

router.post("/allNotification", getNotifications)
router.post("/userNotification", getNotificationByUser)

module.exports = router;