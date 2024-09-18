const jwt = require('jsonwebtoken');
const http = require('http-status-codes');

const VerifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(http.StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(http.StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    }

}

module.exports = VerifyToken