const express = require('express');
const router = express.Router();

const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const listingRoute = require('./listing.route')


router.use('/api/auth', authRoute);
router.use('/api/user', userRoute);
router.use('/api/listing', listingRoute);

module.exports = router