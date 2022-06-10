require("dotenv").config();
import jwt from "jsonwebtoken";
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

exports.checkUser = (req: any) => {
    // Checking Bearer
    let token = req.headers?.authorization?.split(' ')[1];

    try {
        // login by form
        return (token && jwt.verify(token, config.SESSION_SECRET)) ||
            jwt.verify(req.cookies.token, config.SESSION_SECRET);
    } catch (err) {
        return false;
    }
}
