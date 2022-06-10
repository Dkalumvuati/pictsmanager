import {Sequelize, Op } from "sequelize";
import db from "../models";
const {checkUser} =  require("../services/checkUser");
const {removeFile} =  require("../services/uploadHelper");

/**
 * @param request
 * @param response
 */
exports.getAlbums = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "No Albums found",
        data: null,
        status: 404
    }

    const user_from_cookies = checkUser(request);
    const {name, description, can_be_shared} = request.query;
    if (user_from_cookies) {

        try {
            let options;
            // TODO - to optimize soon
            if (name) {
                options = {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }
            }

            if (description) {
                options = {...options,
                    description: {
                        [Op.like]: `%${description}%`
                    }
                }
            }

            if (can_be_shared) {
                options = { ...options,
                    can_be_shared: {
                        [Op.eq]: Boolean(can_be_shared)
                    }
                }
            }

            if (options) {
                options = {
                    where : {
                        [Op.or]: {...options},
                        UserId: user_from_cookies.id
                    }
                }
                data.data = await db.Album.findAll(options);
            } else {
                data.data = await db.Album.findAll({
                    where : {
                        UserId : user_from_cookies.id,
                    },
                    include : [db.Picture]
                });
            }
            // TODO - albums Shared by other user for this User

        } catch (e) {
            data.message = String(e);
        }
    }
    response.status(data.status).json(data);
}

/**
 * TODO - Doing
 * Return the album belong to the Current User
 * @param request
 * @param response
 */
exports.getAlbum = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Album not found",
        data: null,
        status: 404
    }

    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        const  {id} = request.params;
        try {
            // TODO - Return albums shared by other user
            data.data = await db.Album.findOne({
                where : {id, UserId: user_from_cookies.id},
                include: [db.Picture]
            });

            if (data.data) {
                data.message = "Found";
                data.status = 200;
            }
            // TODO - to check also into the ShareAlbum table
        }catch (e) {
            // TODO - do nothing
            data.message = "No Album with this Id";
        }
    }

    response.status(data.status).json(data);
}

/**
 * The current User create a new Album
 * @param request
 * @param response
 */
exports.createAlbum = async function(request : any, response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "Unauthorized",
        data: null,
        status: 401
    }
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        // TODO - Check empty content, injection DOS and other things
        const  {name,description, can_be_shared} = request.body;
        try {
            const user = await db.User.findOne({
                where: {
                    id: user_from_cookies.id
                }
            });

            if (user) {
                data.data = await db.Album.create({
                    name,
                    description,
                    can_be_shared,
                    UserId: user.id
                });
                data.status = 201;
                data.message = "Album created";
            }

        }catch (e : any) {
            // TODO - to activate for Prod
            //data.message = String("Oops!, We found some error on create a new album. Check fields before to try again.");  //Message for  Prod
            data.message = String(e.message); // For dev
            data.status = 401;
        }
    }

    response.status(data.status).json(data);
}

/**
 * Update the Current User's album
 * @param request
 * @param response
 */
exports.updateAlbum = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "Album not found",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const {id} = request.params;
    const {name, description, can_be_shared} = request.body;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            let album = await db.Album.findOne({ where : { id } });
            if (album && album.UserId === user_from_cookies.id) {
                await db.Album.update(
                    {
                        name,
                        description,
                        can_be_shared,
                        updatedAt : Date.now()
                    },
                    { where: { id: album.id }}
                );
                data.data = await db.Album.findOne({where: {id}});
                data.status = 202;
                data.message = "Album was updated successfully";
            } else  {
                data.data = await db.Album.create({
                    name,
                    description,
                    can_be_shared,
                    UserId: user_from_cookies.id
                });

                data.status = 201;
                data.message = "Album created";
            }
        }catch (e) {
            data.message = String(e);
            data.status = 401;
        }
    }
    response.status(data.status).json(data);
}

/**
 * Delete album belong to the current user
 * @param request
 * @param response
 */
exports.deleteAlbum = async function(request :any , response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "Album not found",
        data: null,
        status: 404
    }

    const  {id} = request.params;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            let album = await db.Album.findOne({ where: { id, UserId: user_from_cookies.id }, include : [db.Picture]});
            let result = await db.Album.destroy({ where: { id, UserId: user_from_cookies.id }});
            if (result !== 0) {

                // Remove all Picture files belong to Album
                for (let i = 0; i < album.Pictures.length; i++) {
                    if (album.Pictures[i].filename) {
                        removeFile(album.Pictures[i].filename);
                    }
                }
                data.message = "Album was deleted successfully";
                data.status = 200;
            }
        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

exports.searchAlbum = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "No Album found",
        data: null,
        status: 404
    }

    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        const  {name} = request.query;
        try {
            let result = await db.Album.findAll({
                where : {
                    [Op.or]: [
                        {
                            name: {[Op.like]: `%${name}%`}
                        }
                    ],
                    UserId: user_from_cookies.id
                },
                include : [db.Picture]
            });
            if ( result && result.length > 0 ) {
                data.data = result;
                data.message = "Found";
                data.status = 200;
            }
        }catch (e) {
            data.message = String(e);
        }
    }
    response.status(data.status).json(data);
}