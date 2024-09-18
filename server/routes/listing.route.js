const express = require('express')
const { createListing } = require('../controllers/listing.controller');
const VerifyToken = require('../utils/verifyUser');

const router = express.Router();

router.post('/create', VerifyToken, createListing);


module.exports = router