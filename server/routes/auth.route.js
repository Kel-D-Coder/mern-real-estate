const express = require('express');
const {signUp, signIn, signWithGoogle, signOut} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/google', signWithGoogle);
router.get('/sign-out', signOut)

module.exports = router