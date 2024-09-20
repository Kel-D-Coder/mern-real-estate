const http = require('http-status-codes');
const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const Listing = require('../models/listing.model.js')

const test = (req, res) => {
    res.json({ message: "Hello world"})
}

const updateUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.satus(http.StatusCodes.UNAUTHORIZED).json({ message: 'You can only update your own account!' });
    }

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                password: req.body.password,
                ...req.body
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc
        
        res.status(http.StatusCodes.OK).json(rest)
    } catch (error) {
        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
}

const deleteUser = async (req, res) => {
    if (req.params.id !== req.params.id) {
        return res.status(http.StatusCodes.UNAUTHORIZED).json({ message: 'You can only delete your own account' });
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(http.StatusCodes.OK).json({ message: "User has been deleted" });
    } catch (error) {
        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
}

const getUserListing = async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(http.StatusCodes.OK).json(listings)
        } catch (error) {
            return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        }
    } else {
        return res.status(http.StatusCodes.UNAUTHORIZED).json({ message: "You can only view your own listing" });
    }
}

module.exports = {
    test,
    updateUser,
    deleteUser,
    getUserListing
}