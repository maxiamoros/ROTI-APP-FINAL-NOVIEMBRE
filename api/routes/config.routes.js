const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', configController.getConfig);
router.put('/', verifyToken, requireAdmin, configController.updateConfig);
router.post('/batch', verifyToken, requireAdmin, configController.batchUpdateConfig);

module.exports = router;
