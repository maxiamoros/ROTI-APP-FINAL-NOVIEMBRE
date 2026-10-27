const express = require('express');
const { chatWithIA } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', chatWithIA);
router.post('/chat', chatWithIA);

module.exports = router;
