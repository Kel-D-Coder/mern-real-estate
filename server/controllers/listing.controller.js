const http = require('http-status-codes');
const Listing = require('../models/listing.model');

const createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(http.StatusCodes.CREATED).json(listing)
    } catch (error) {
        res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured' })
    }
}

module.exports = {
    createListing
}