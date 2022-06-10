import db from "../models";
import models from "../models";
const {checkUser} =  require("../services/checkUser");
const {removeFile} =  require("../services/uploadHelper");

/**
 * Only on dev and for Admin User
 * @param request
 * @param response
 */
exports.getUsers = async function(request :any , response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "You are not allowed to see this",
        data: null,
        status: 401
    }

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);

    // TODO - to verify also the current User's password
    if (user_from_cookies && user_from_cookies.role === "ROLE_ADMIN") {
        // TODO - to make it strong
        try {
            data.data = await db.User.findAll({
                attributes :  {
                    exclude: ['password'],
                },
                include: [db.Album]
            });
        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Only for Admin User
 * @param request
 * @param response
 */
exports.getUser = async function(request :any , response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "User not found or You are not allowed to see this",
        data: null,
        status: 404
    }

    const  {id} = request.params;
    const user_from_cookies = checkUser(request);

    if (user_from_cookies && user_from_cookies.role === "ROLE_ADMIN") {
        try {
            data.data = await db.User.findOne({
                where : {id},
                attributes :  {
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
                data.message = "User found";
            }
        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * This is the only function for admin to create a new User
 * @param request
 * @param response
 */
exports.createUser = async function(request : any, response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const  {email, password, lastname, firstname} = request.body;

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);

    // TODO - to verify also the current User's password
    if (user_from_cookies && user_from_cookies.role === "ROLE_ADMIN") {
        try {
            data.data = await db.User.create({
                email,
                password,
                lastname,
                firstname
            });
            data.status = 201;
            data.message = "User created";
        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * The current User can now update infos and upload Picture
 * @param request
 * @param response
 */
exports.updateUser = async function(request : any, response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "Impossible to update this user's file",
        data: null,
        status: 401
    }

    const  {password, lastname, firstname} = request.body;
    const file = request.file;

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);

    // TODO - to verify also the current User's password
    if (user_from_cookies) {
        try {
            let user = await db.User.findOne({
                where : {
                    id : user_from_cookies.id
                }
            });

            if (user) {
                let user_data = {password, lastname, firstname, updatedAt: Date.now(), avatar: user.avatar };
                if (file) {
                    user_data = {...user_data, avatar: file.path};
                    if (user.avatar) {
                        removeFile(user.avatar);
                    }
                }

                let response = await db.User.update(
                    user_data,
                    { where: { id : user.id } }
                );
                if (response[0] === 1) {
                    data.message = "User's infos were updated";
                    data.status = 202;
                }
            } else {
                data.message = "You are not longer in the database.";
            }
        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 *  (Dont use it to delete User)
 * @param request
 * @param response
 */
exports.deleteUser = async function(request :any , response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "Yo cannot delete this user" ,
        data: null,
        status: 401
    }

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);

    if (user_from_cookies && user_from_cookies.role === "ROLE_ADMIN") {
        try {
            let user = await db.User.findOne({ where: { id : user_from_cookies.id }});
            let result = await db.User.destroy({ where: { id : user.id }});

            if (result) {
                if (user.avatar) {
                    removeFile(user.avatar);
                }
                data.message = "User was deleted";
                data.status = 200;
            }
        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }

    response.json(data).status(data.status);
}