import db from "../models";
const {checkUser} =  require("../services/checkUser");
import models from "../models";

/**
 * Return all Current User's shared photo
 * Photo where the current User was added by other user
 * @param request
 * @param response
 */
exports.getAllSharePictures = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Not found",
        data: null,
        status: 404
    }

    // TODO - to make it strong
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {

        try {
            // TODO - to return Pictures instead SharedPictures
            data.data = await db.SharePicture.findAll({
                where: { UserId : user_from_cookies.id }
            });
            if (data.data) {
                data.message = "Success";
                data.status = 200;
                // TODO - to find each picture from this data.data array to return
            }

        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Return a Picture shared for for this  current User
 * @param request
 * @param response
 */
exports.allUserSharePicture = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Not found",
        data: null,
        status: 404
    }
    const {PictureId} = request.params;

    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            data.data = await db.SharePicture.findOne({ where: { PictureId, UserId:user_from_cookies.id }});
            data.message = "Success";
            data.status = 200;
        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * The Current User can share his/her picture to Other users
 * @param request
 * @param response
 */
exports.sharePicture = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "Oops ! you cannot share this Picture",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const  {PictureId, UsersId} = request.body;

    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {

        try {
            const picture = await db.Picture.findOne({
                where : {
                    id: PictureId
                },
                include: [
                    {
                        model: db.Album, as: 'album',
                        where: {
                            UserId: user_from_cookies.id
                        }
                    }
                ]
            });

            if (picture) {
                for (let i = 0; i < UsersId.length; i++) {
                    await db.SharePicture.create({
                        UserId: UsersId[i],
                        PictureId
                    });
                }
                data.message = "Congratulations ! You shared your picture";
                data.status = 201;
            }
        }catch (e) {
            data.message = String(e);
            data.message = "You already shared this picture this User";
        }
    }

    response.json(data).status(data.status);
}

/**
 * Stop sharing
 * @param request
 * @param response
 */
exports.unSharePicture = async function(request : any, response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "Yo cannot unShare this picture",
        data: null,
        status: 401
    }
    // TODO - UserId wil come from CurrentUser Session
    const  {UsersId, PictureId} = request.body;
    // TODO - check is this Useridnis the same of UserId from sessions

    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            let picture = await db.Picture.findOne({
                include: [
                    {
                        model: db.Album, as: 'album',
                        where: {
                            UserId: user_from_cookies.id
                        }
                    },
                    {
                        model: db.Tag
                    }
                ]

            });
            if (picture) {
                let result = 0;
                for (let i = 0; i < UsersId.length; i++) {

                    // TODO - destroy only the current User connected
                    result += await db.SharePicture.destroy(
                        {
                            where:{ UserId: UsersId[i], PictureId},
                        }
                    );
                }

                if (result !== 0) {
                    data.message = "Picture was unShared";
                    data.status = 201;
                }
            }

        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
            data.status = 404;
        }
    }

    response.json(data).status(data.status);
}