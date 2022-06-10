import db from "../models";
const {checkUser} =  require("../services/checkUser");

/**
 * Find Albums shared to the current user
 * @param request
 * @param response
 */
exports.getAllShareAlbum = async function(request :any , response : any) : Promise<any>
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
            data.data = await db.ShareAlbum.findAll({where: { UserId : user_from_cookies.id }});
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
 * Find Album shared to the current user
 * @param request
 * @param response
 */
exports.allUserShareAlbum = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Not found",
        data: null,
        status: 404
    }
    const  {AlbumId} = request.params;

    // TODO - to make it strong
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            data.data = await db.ShareAlbum.findAll({ where: { AlbumId, UserId : user_from_cookies.id }});
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
 * the current User share ihis/her album to others users
 * @param request
 * @param response
 */
exports.shareAlbum = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "Congratulations ! You liked this Album",
        data: null,
        status: 201
    }

    // TODO - to secure
    // TODO - Check empty content, injection DOS and other things
    const  {AlbumId, UsersId} = request.body;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {

        try {
            const Album = await db.Album.findOne({
                where : {
                    id: AlbumId,
                    UserId: user_from_cookies.id
                }
            });

            if (Album) {
                for (let i = 0; i < UsersId.length; i++) {
                    data.data = await db.ShareAlbum.create({
                        UserId: UsersId[i],
                        AlbumId
                    });
                }
            } else {
                data.message = "Oops ! you cannot share this Album";
                data.status = 401;
            }
        }catch (e) {
            data.message = String(e);
            data.status = 401;
        }
    }

    response.json(data).status(data.status);
}

/**
 * Remove User from the Current User's album
 * @param request
 * @param response
 */
exports.unShareAlbum = async function(request : any, response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message:  "Yo cannot unShare this Album",
        data: null,
        status: 401
    }
    // TODO - UserId wil come from CurrentUser Session
    const {AlbumId, UsersId} = request.body;
    const user_from_cookies = checkUser(request);

    if (user_from_cookies) {
        try {
            let album = await db.Album.findOne({
                where: {
                    id: AlbumId,
                    UserId: user_from_cookies.id
                }
            });

            if (album) {
                let result = 0;
                for (let i = 0; i < UsersId.length; i++) {

                    // TODO - destroy only the current User connected
                    result += await db.ShareAlbum.destroy(
                        {
                            where:{ UserId: UsersId[i], AlbumId},
                        }
                    );
                }
                if (result !== 0) {
                    data.message = "Album was unShared";
                    data.status = 200;
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