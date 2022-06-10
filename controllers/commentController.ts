import db from "../models";
const {checkUser} =  require("../services/checkUser");

/**
 * REturn all Picture 's comments
 * @param request
 * @param response
 */
exports.getCommentsByPictureId = async function(request :any , response : any) : Promise<any>
{
    // TODO - If the current User is connected => return all Comments
    // TODO - to refactor
    let data = {
        message: "Not found",
        data: null,
        status: 401
    }
    const  {PictureId} = request.params;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            data.data = await db.Comment.findAll({
                where: {
                    PictureId
                }
            });
            data.message = "";
            data.status = 200;
        } catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }
    response.json(data).status(200);
}

exports.getComment = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Success",
        data: null,
        status: 200
    }
    const  {id} = request.params;
    // TODO - to make it strong

    const user_from_cookies = checkUser(request);

    if (user_from_cookies) {
        try {
            data.data = await db.Comment.findOne({
                where: {
                    id,
                    UserId: user_from_cookies.id
                }
            });
        } catch (e) {
            // TODO - do nothing
            data.message = String(e);
            data.status = 404;
        }
    }
    response.json(data).status(200);
}

/**
 * allow the current user to comment Picture that has access
 * @param request
 * @param response
 */
exports.setComment = async function(request : any, response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "This action requires connection",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const {comment} = request.body;
    const {PictureId} = request.params;
    const user_from_cookies = checkUser(request);

    if (user_from_cookies) {
        // Check if this Current User has an access to this picture
        let pictureShared = await db.SharePicture.findOne({where: {PictureId, UserId: user_from_cookies.id}});
        try {
            if (pictureShared) {
                data.data = await db.Comment.create({
                    UserId: user_from_cookies.id,
                    PictureId,
                    comment,
                });

                data.status = 201;
                data.message = "Comment created";
            } else {
                data.message = "You are allowed to comment this picture.";
            }
        } catch (e: any) {
            // TODO - to activate for Prod
            //data.message = String("Oops!, We found some error on create a new Comment. Check fields before to try again.");  //Message for  Prod
            data.message = String(e.message); // For dev
        }

    }

    response.json(data).status(data.status);
}

/**
 * The current User and Comment' Owner only can edit the comment
 * @param request
 * @param response
 */
exports.updateComment = async function(request : any, response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "Comment not found",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const  {id} = request.params;
    const {comment} = request.body;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies && id) {
        try {
            let comment_ = await db.Comment.findOne({ where : { id , UserId: user_from_cookies.id} });
            if (comment_) {
                await db.Comment.update(
                    {
                        comment
                    },
                    { where: { id } }
                );
                data.message = 'Comment edited successfully';
                data.status = 202;
            }
        }catch (e) {
            data.message = String(e);
        }
    }
    response.json(data).status(data.status);
}

/**
 * Delete the coomment of the current User
 * @param request
 * @param response
 */
exports.deleteComment = async function(request :any , response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "This acation requires to be connected",
        data: null,
        status: 401
    }

    const  {id} = request.params;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            let result = await db.Comment.destroy({
                where: {
                    id,
                     UserId : user_from_cookies.id
                }
            });
            if (result > 0) {
                data.message = "Comment deleted successfully";
                data.status = 201;
            } else {
                data.message = "You cannot delete a comment that does not exist"
            }
        } catch (e) {
            // TODO - do nothing
            data.message = String(e);
        }
    }

    response.json(data).status(data.status);
}
