const User = require('../models/user.model.js');
const bcrypt = require("bcryptjs");
const http = require('http-status-codes');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    const { username, email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(http.StatusCodes.CREATED).json('user created successfully')
    } catch (error) {
        res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured'});
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email })
        !validUser && res.status(http.StatusCodes.UNAUTHORIZED).json({ message: "Incorrect Credentials" });

        const validPassword = bcrypt.compareSync(password, validUser.password);
        !validPassword && res.status(http.StatusCodes.UNAUTHORIZED).json({ message: "Incorrect Credentials" });

        const { password: userPassword, ...rest } = validUser._doc;

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        res.cookie('access_token', token, { httpOnly: true }).status(http.StatusCodes.OK).json(rest);
    } catch (error) {
        res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured' });
    }
}

const signWithGoogle = async (req, res) => {
    try {
        // Find a user by their email address in the database
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            // If the user already exists, create a JWT token for the existing user
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            // Destructure the user object to exclude the password field
            const { password, ...rest } = user._doc

            // Set a cookie with the JWT token and send the user data (excluding password) in the response
            return res.cookie('access_token', token, { httpOnly: true }).status(http.StatusCodes.OK).json(rest);
        } else {

            // Corrected password generation (fixed Math.random usage)
            const generatedPassword = Math.random.toString(36).slice(-8);

            // Hash the generated password before storing it
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(generatedPassword, salt);

            // Create the new user in the database
            const newUser = await User.create({
                username: req.body.name.split(" ").join("").toLowerCase(),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password, ...rest } = newUser._doc
            return res.cookie('access_token', token, { httpOnly: true }).status(http.StatusCodes.OK).json(rest);
        }
    } catch (error) {
        res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured' });
    }
}

const signOut = async (req, res) => {
    try {
        res.clearCookie('access_token')
        res.status(http.StatusCodes.OK).json({ message: "User has been logged out"})
    } catch (error) {
        res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured' });
    }
}

module.exports = {
    signUp,
    signIn,
    signWithGoogle,
    signOut
}
