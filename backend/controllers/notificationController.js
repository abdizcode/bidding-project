const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotificationByUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const { id } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: err.message });
            }
        });
        const notifications = await Notification.find({ userId: id });
        res.status(200).json({ notifications });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getNotifications,
    getNotificationByUser
}
