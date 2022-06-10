// TODO - Refactor
require('dotenv').config();
import jwt from "jsonwebtoken";
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.AUTH_EMAIL,
        pass: config.AUTH_PASS,
        //smtp: { host: string; port: number; secure: boolean };
    },
});

exports.sendEmail = (option :any, next: Function) => {
    const options = {
        from: config.AUTH_EMAIL,
        to: option.email,
        subject : option.subject,
        text: option.message,
        html: ''
    };

    if (option.html) {
        options.html = option.message
    } else {
        options.text = option.message
    }

    transport.sendMail(options, (error)=>{
        if (error) {
            console.error("Error on send Notification.");
            console.log(error)
        }
        next(option.response);
    });
}