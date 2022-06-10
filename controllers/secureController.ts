import db from "../models";
import models from "../models";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import path from "path";
const { checkUser } = require("../services/checkUser");
const { sendEmail } = require("../services/mailing");
const { removeFile, removeDir } = require("../services/uploadHelper");

// TODO - to refactore
require("dotenv").config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
// -----------------------------

const saltRound = 10;

/**
 * Home page that will be connected with Swagger
 * @param request
 * @param response
 */
exports.getHome = async function (request: any, response: any): Promise<any> {
    // TODO - install Swagger API
    response.status(200).redirect('/api-docs');
}

/**
 * Login User with password and email
 * @param request
 * @param response
 */
exports.login = async function (request: any, response: any): Promise<any> {
    // TODO - o check this Method

    let data = {
        message: "Invalid email or password. Check you log before to retry.",
        data: null,
        status: 401
    }

    const { email, password } = request.body;

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);
    // TODO - to verify also the current User's password
    if (user_from_cookies && user_from_cookies.email === email && bcrypt.compareSync(password, user_from_cookies.password)) {
        let user = await db.User.findOne(
            {
                where: { email: user_from_cookies.email },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: models.Picture,
                        as: "picturesLiked"
                    },
                    {
                        model: models.Album
                    }
                ]
            });

        return response.status(200).json({
            message: 'User already logged in',
            user: user
        });
    }

    try {
        const user = await db.User.findOne({ where: { email } });

        if (user && bcrypt.compareSync(password, user.password)) {
            // Create a ssession
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role,
            }, config.SESSION_SECRET, {
                expiresIn: '1h' // expires in 1 hour.
            });

            const return_user_info = {
                id: user.id,
                email: user.email,
                lastname: user.lastname,
                role: user.role,
                firstname: user.firstname,
                avatar: user.avatar,
                isValidated: user.isValidated,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }

            if (user) {
                data.data = user;
                data.status = 200;
                data.message = "User logged in successfully";
            }
            return response.status(data.status).cookie('token', token, { httpOnly: true })
                .json({
                    message: data.message,
                    data: return_user_info,
                    status: data.status
                });

        }
    } catch (e) {
        // TODO - do nothing
        data.message = String(e);
        //data.message = "No User with this Id";
        data.status = 404;
    }

    response.status(data.status).json(data);
}

/**
 * Return the current User info
 * @param request
 * @param response
 */
exports.getMe = async function (request: any, response: any): Promise<any> {
    // TODO - o check this Method
    let data = {
        message: "You have to log in first.",
        data: null,
        status: 401
    };

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);
    // TODO - to verify also the current User's password
    if (user_from_cookies) {
        data.data = await db.User.findOne(
            {
                where: { email: user_from_cookies.email },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: models.Picture,
                        as: "picturesLiked"
                    },
                    {
                        model: models.Album
                    }
                ]
            });
        if (data.data) {
            data.status = 200;
            data.message = "User info";
        }
        return response.status(data.status).json(data);
    }
    response.status(data.status).json(data);
}

/**
 * registes user inito the database
 * @param request
 * @param response
 */
exports.register = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: "",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const { email, password, lastname, firstname } = request.body;

    try {
        let user = await db.User.findOne({ where: { email } });
        if (user) {
            data.message = "This email is already taken.";
        } else {
            user = await db.User.create({
                email,
                password,
                lastname,
                firstname
            });

            if (user) {
                data.status = 201;
                data.message = "Congratulation ! You are now registerred in Pitcmanager Application";

                // TODO - to send a notification/e-mail to This User
                return sendEmail(
                    {
                        email: user.email,
                        subject: data.message,
                        html: true,
                        message: `<a href="${config.SITE_URL}/users/validate_email/${user.id}" style="padding: .7rem 1.2rem;">Clique here to validate you email</a>`,
                        response
                    }, (resp: any) => {
                        resp.status(data.status).json(data);
                    });
            }
        }
    } catch (e) {
        data.message = String(e);
    }

    response.status(data.status).json(data);
}

/**
 * The current User can now update infos and upload Picture
 * @param request
 * @param response
 */
exports.updateUser = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: "Impossible to update this user's file",
        data: null,
        status: 401
    }

    const { password, lastname, firstname } = request.body;
    const file = request.file;

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);

    // TODO - to verify also the current User's password
    if (user_from_cookies) {
        try {
            let user = await db.User.findOne({
                where: {
                    id: user_from_cookies.id
                }
            });

            if (user) {
                let user_data = { password, lastname, firstname, updatedAt: Date.now(), avatar: user.avatar };
                if (file) {
                    user_data = { ...user_data, avatar: file.path };
                    if (user.avatar) {
                        removeFile(user.avatar);
                    }
                }

                let response = await db.User.update(
                    user_data,
                    { where: { id: user.id } }
                );
                if (response[0] === 1) {
                    data.message = "User's infos were updated";
                    data.status = 202;
                }
            } else {
                data.message = "You are not longer in the database.";
            }
        } catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Reset Password and  sends email with password uri
 * @param request
 * @param response
 */
exports.reset = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: 'If you have a valide account, an email will be sent to you !',
        data: null,
        status: 200
    }

    // TODO - Check empty content, injection DOS and other things
    const { email } = request.body;
    try {
        let user = await db.User.findOne({
            where: {
                email
            },
            attributes: {
                exclude: ['password']
            }
        });
        if (user) {
            // TODO - to send email with uri + user.id to this user
            const uri = request.url + '/' + user.id;
            return sendEmail(
                {
                    email: user.email,
                    subject: "Reset password",
                    message: `<a href="${config.SITE_URL}/${uri}" style="padding: .7rem 1.2rem;">Click to change you password !</a>`,
                    html: true,
                    response
                }, (resp: any) => {
                    resp.json(data).status(data.status);
                });
        }
    } catch (e) {
        // Do nothing
    }

    response.status(data.status).json(data);
}

/**
 * Reset Password Handler
 * @param request
 * @param response
 */
exports.resetHandler = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: "Error on changing User password",
        data: null,
        status: 401
    }

    // TODO - to secure
    // TODO - Check empty content, injection DOS and other things
    const { id } = request.params;
    const { password } = request.body;
    try {
        let user = await db.User.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['password']
            }
        });

        if (user) {
            // TODO - To send email with the url.userId for to change password
            await db.User.update({
                password,
                updatedAt: Date.now()
            }, {
                where: {
                    id
                }
            });
            data.data = user;
            data.status = 202;
            data.message = "Your password was changed successfully";
        }
    } catch (e) {
        data.message = String(e);
    }

    response.status(data.status).json(data);
}

/**
 * Sends email
 * @param request
 * @param response
 */
exports.validateEmail = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: "Error on validate your email.",
        data: null,
        status: 401
    }

    // TODO - to secure
    // TODO - Check empty content, injection DOS and other things
    const { id } = request.params;
    try {
        let user = await db.User.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['password']
            }
        });

        if (user) {
            if (user.isValidated) {
                data.status = 200;
                data.message = "Your account is already validated.";
            } else {
                await db.User.update({
                    isValidated: true,
                    updatedAt: Date.now()
                }, {
                    where: {
                        id
                    }
                });

                data.status = 202;
                data.message = "Congratulation ! Your account is now validated.";

                return sendEmail(
                    {
                        email: user.email,
                        subject: "Unregister from PictsManager.",
                        message: "Congratulation ! Your account is now validated.",
                        response
                    }, (resp: any) => {
                        resp.json(data).status(data.status);
                    });

            }
        }
    } catch (e) {
        data.message = String(e);
    }

    response.status(data.status).json(data);
}

/**
 * Delete the current user from database and all of his/her data
 * @param request
 * @param response
 */
exports.unRegister = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: "Yo cannot delete this user",
        data: null,
        status: 401
    }

    try {
        let user_from_cookies = checkUser(request);

        // Retrieve all Picture's from albums
        if (user_from_cookies) {
            let user = await db.User.findOne({ where: { id: user_from_cookies.id }, include: [db.Album] });
            let albums_pictures_name = [];
            for (let i = 0; i < user.Albums.length; i++) {
                let album = await db.Album.findOne({ where: { id: user.Albums[i].id, UserId: user_from_cookies.id }, include: [db.Picture] });
                for (let j = 0; j < album?.Pictures.length; j++) {
                    albums_pictures_name.push(album.Pictures[j].filename);
                }
            }

            if (user) {
                // TODO - Have to deactivate account intead destroying it
                let result = await db.User.destroy({ where: { id: user_from_cookies.id } });
                data.message = 'User was deleted';
                data.status = 200;

                // Remove Cookies
                if (result) {

                    // Remove Avatar's file
                    if (user.avatar) {
                        removeFile(user.avatar);
                    }

                    // Remove all picture from upload dir
                    if (albums_pictures_name.length > 0) {
                        for (let i = 0; i < albums_pictures_name.length; i++) {
                            removeFile(albums_pictures_name[i]);
                        }

                        // Remove User Folder

                        let user_folder = albums_pictures_name[0] ? albums_pictures_name[0].split('/') : '';
                        delete user_folder[user_folder.length - 1];
                        user_folder = user_folder.join('/');
                        removeDir(user_folder);
                    }

                    return sendEmail(
                        {
                            email: user.email,
                            subject: "Unregister from PictsManager.",
                            message: "your account was deleted from our database.",
                            response
                        }, (resp: any) => {
                            if (request.cookies.token) {
                                response.status(data.status).clearCookie('token').send(data);
                            } else {
                                response.status(data.status).send(data);
                            }
                        });
                }
            }
        }

    } catch (e) {
        // TODO - do nothing
        data.message = String(e);
        data.status = 404;
    }

    response.status(data.status).json(data);
}

/**
 * To logout the currentUser connected
 * @param request
 * @param response
 */
exports.logout = async function (request: any, response: any): Promise<any> {
    // TODO - to factorize
    let data = {
        message: "You are not connected",
        data: null,
        status: 401
    }

    // TODO - to add code according UseCase
    try {
        let user_from_cookies = checkUser(request);
        if (user_from_cookies) {
            data.message = "You are now logged out"
            data.status = 200;
            response.clearCookie('token');
        }

    } catch (e) {
        // TODO - do nothing
        data.message = String(e);
        data.status = 404;
    }

    response.status(data.status).json(data);
}
