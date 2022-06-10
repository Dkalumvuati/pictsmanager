import db from "../models";
const {checkUser} =  require("../services/checkUser");

/**
 * REturn all Current User's liked Picture that he/she liked before
 * @param request
 * @param response
 */
exports.getLikesPicture = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "You have to be logged in",
        data: null,
        status: 401
    }

    // TODO - to make it strong
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            let likedPicture = await db.LikePicture.findAll({
                where: {
                    UserId: user_from_cookies.id
                }
            });
            if (likedPicture.length > 0) {
                data.data = likedPicture;
                data.status = 200;
            }else {
                data.message = "Not pictures found.";
                data.status = 404;
            }
        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }

    response.json(data).status(200);
}

/**
 * The current User Like only pictures that has access
 * @param request
 * @param response
 */
exports.likePicture = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "Congratulations ! You liked this picture",
        data: null,
        status: 201
    }

    // TODO - to secure
    // TODO - Check empty content, injection DOS and other things
    const  {PictureId} = request.body;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {

        try {
            // Only the Shared Picture
            let sharedPicture = await db.SharePicture.findOne({ where: { PictureId, UserId:user_from_cookies.id }});
            if (sharedPicture) {
                data.data = await db.LikePicture.create({
                    UserId: user_from_cookies.id,
                    PictureId : sharedPicture.PictureId
                });
            } else {
                data.message = "Oops ! you cannot like this Picture";
                data.status = 401;
            }
        }catch (e) {
            //data.message = String(e);
            data.message = "May be, you already liked this picture before.";
            data.status = 401;
        }
    }

    response.json(data).status(data.status);
}

/**
 * Unlike a liked picture that the current User has access
 * @param request
 * @param response
 */
exports.unLikePicture = async function(request : any, response : any) : Promise<any>
{
    // TODO - to factorize
    let data = {
        message: "Picture was unliked",
        data: null,
        status: 200
    }

    const  {PictureId} = request.params;

    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            // TODO - have to check cookies, header or ssessions in the order to search token
            let result = await db.LikePicture.destroy({ where:{ UserId:user_from_cookies.id, PictureId}});

            if (result === 0) {
                data.message = "Yo cannot unlike this picture";
                data.status = 401;
            }

        }catch (e) {
            // TODO - do nothing
            data.message = String(e);
            data.status = 404;
        }
    }

    response.json(data).status(data.status);
}