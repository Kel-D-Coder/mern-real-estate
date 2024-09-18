const express = require('express');
const { test, updateUser, deleteUser } = require('../controllers/user.controller');
const VerifyToken = require('../utils/verifyUser')

const router = express.Router();

router.get('/test', test)
router.patch('/update/:id', VerifyToken, updateUser)
router.delete('/delete/:id', VerifyToken, deleteUser)

module.exports = router