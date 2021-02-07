const express = require('express');
const router = express.Router();
const { Message } = require('../models/message');

/* Get messages */
router.get('/', async (req, res) => {
    const { username } = req.query || req.body;
    const messages = await Message.find({}).sort('timestamp');
    res.render('chatroom', { username, messages });
});

module.exports = router;
