require("dotenv").config();
import jwt from "jsonwebtoken";
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

exports.isAuthenticated = (req: any, rep: any, next: any) => {
    let token = req.headers?.authorization?.split(' ')[1];

    try {
        if ((token && jwt.verify(token, config.SESSION_SECRET)) ||
            jwt.verify(req.cookies.token, config.SESSION_SECRET)) {
            next();
        }
    } catch (err) {
        rep.status(401).send({
            message: 'Access denied'
        })
    }
}

exports.cleanCookie = (request:any, response : any, message :string) => {
    try {
        //Remove cookie token from response
        if (request.cookies.token) {
            response.status(200).clearCookie('token').send({message});
        } else {
            response.status(404).send({
                message: 'User not logged in'
            });
        }
    } catch (e) {
        response.status(404).json({
            message: 'No cookies found'
        });
    }
}

