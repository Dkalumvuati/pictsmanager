import { Op } from "sequelize";
import db from "../models";
const {checkUser} =  require("../services/checkUser");
const {removeFile} =  require("../services/uploadHelper");

/**
 * TODO : to look how to  propagate the Current User in the order to avoid checkUser() again
 * TODO : search with TagId
 * Return pictures into the current User's album
 * @param request
 * @param response
 */
exports.getPictures = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Success",
        data: null,
        status: 200
    };

    // TODO : rearch with TagId
    const {filename, description, can_be_shared} = request.query;

    // Chek if User is Already connected
    const user_from_cookies = checkUser(request);

    // TODO - to verify also the current User's password
    if (user_from_cookies) {
        try {
            // TODO - to optimize soon
            let options;
            if (filename) {
                options = {
                    filename: {
                        [Op.like]: `%${filename}%`
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
            // if (TagId) {
            //     options = { ...options,
            //         TagId: {
            //             [Op.eq]: Number(TagId)
            //         }
            //     }
            // }

            if (options) {
                options = {
                    where : { [Op.or]: {...options} },
                    include: [
                        {
                            model: db.Album, as: 'album',
                            where: { UserId: user_from_cookies.id }
                        },
                        { model: db.Tag },
                        { model: db.Comment }
                    ]
                }
                data.data = await db.Picture.findAll(options);
            } else {
                data.data = await db.Picture.findAll({
                    include: [
                        {
                            model: db.Album, as: 'album',
                            where: {
                                UserId: user_from_cookies.id
                            }
                        },
                        {
                            model: db.Tag
                        },
                        {
                            model: db.Comment
                        }
                    ]
                });
            }
        } catch (e) {
            data.message = String(e);
            data.status = 401;
        }
    }

    response.status(200).json(data);
}

/**
 * Return only a picture into the current User's Album
 * @param request
 * @param response
 */
exports.getPicture = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Picture not found",
        data: null,
        status: 404
    }

    const {id} = request.params;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            // Get Picture belongs to the CurrentUser's Album
            data.data = await findOneById(id, user_from_cookies.id);
            data.message = "Picture found";
            data.status = 200;
        } catch (e) {
            // TODO - do nothing
            data.message = "No Picture with this Id";
        }
    }
    response.status(data.status).json(data);
}

/**
 * Create picture and set it into the Album Given or set it into the Default Album
 * @param request
 * @param response
 */
exports.createPicture = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "You are not allowed to create a picture",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const  {mime,description, can_be_shared, AlbumId, tags} = request.body;
    const user_from_cookies = checkUser(request);
    const file = request.file;
    if (user_from_cookies) {
        try {
            let album = await db.Album.findOne({
                where: {
                    id: AlbumId,
                    UserId: user_from_cookies.id
                }
            });

            let picture;
            let created;
            // This album must belond this User
            if (!album) {
                // Else the picture will belongs the Default Album
                // For a picture without album will belongs this Defeault Album
                [album, created] = await db.Album.findOrCreate({
                    where: { name: 'default', UserId: user_from_cookies.id },
                    defaults: {
                        name: 'default',
                        description: 'the Default album for picture without album',
                        can_be_shared: true,
                        UserId: user_from_cookies.id
                    }
                });
            }

            if (file) {
                picture = await db.Picture.create({
                    filename: request.file.path,
                    mime: request.file.mimetype,
                    description,
                    can_be_shared,
                    AlbumId: album.id // Required
                });
                data.message = "Picture created";
            }

            for (let i = 0; i < tags.length; i++) {
                let tag = await db.Tag.findOne({
                    where: {id : tags[i]}
                });

                if (tag) {
                    let result = await tag.addPicture(picture, {through: {selfGranted: false}});
                }
            }

            data.data = await db.Picture.findOne({
                where : {id: picture.id},
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
            data.status = 201;
        }catch (e) {
            //data.message = "Oops!, We found some error on create a new album. Check fields before to try again.";
            data.message = String(e);
            data.status = 401;
        }
    }

    response.status(data.status).json(data);
}

/**
 * Update a picture belongs to the current User's album
 * @param request
 * @param response
 */
exports.updatePicture = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "You must be logged in.",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const {id} = request.params;
    const { mime, description, AlbumId, can_be_shared, tags} = request.body;
    const user_from_cookies = checkUser(request);
    const file = request.file;

    if (user_from_cookies) {
        try {
            let picture = await findOneById(id, user_from_cookies.id);

            if (picture) {
                // Join request
                let picture_data =
                    {
                        description,
                        can_be_shared,
                        AlbumId,
                        filename: picture.filename,
                        mime: picture.mime,
                        updatedAt: Date.now()
                    };

                    if (file) {
                        picture_data = {...picture_data, filename: file.path, mime: file.mimetype};
                        if (picture.filename ) {
                            removeFile(picture.filename);
                        }
                    }
                let result = await db.Picture.update( picture_data,{ where: { id }});

                if (tags) {
                    // Remove all existance tags in the order to set the new one
                    await picture.removeTags(picture.Tags);
                    for (let i = 0; i < tags.length; i++) {
                        let tag = await db.Tag.findOne({ where: {id: tags[i]} });

                        if (tag) {
                            let result = await tag.addPicture(picture, {through: {selfGranted: false}});
                        }
                    }
                } else  {
                    data.message = "Not picture found";
                }

                if (result != 0) {
                    data.status = 202;
                    data.message = "Picture updated successfly";
                }
            } else {
                data.message ='You are not the owner of this picture';
            }

        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Remove pictures from an given AlbumId
 * @param request
 * @param response
 */
exports.getRemovePicturesFromAlbum = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "You must be logged in.",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const {PicturesId, AlbumId } = request.body;
    const user_from_cookies = checkUser(request);

    if (user_from_cookies) {
        try {
            let picture = 0;
            let album = await db.Album.findOne({
                where : {id: AlbumId, UserId: user_from_cookies.id},
                include: [db.Picture]
            });

            if (album && PicturesId) {
                // Remove all existance tags in the order to set the new one
                await album.removePictures(PicturesId);
                const [defaultAlbum, created] = await db.Album.findOrCreate({
                    where: { name: 'default', UserId: user_from_cookies.id },
                    defaults: {
                        name: 'default', UserId: user_from_cookies.id
                    }
                });

                for (let i = 0; i < PicturesId.length; i++) {
                    picture += await db.Picture.update(
                        {
                            AlbumId: defaultAlbum.id,
                            updatedAt : Date.now()
                        },
                        { where: { id: PicturesId[i] }}
                    );
                }

                // The updated Picture
                if (picture > 0) {
                    data.status = 202;
                    data.message = "Picture updated successfly";
                }
            } else {
                data.message ='You are not the owner of this picture';
            }

        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Move pictures from the sourcce album to a given AlbumId
 * @param request
 * @param response
 */
exports.getMovePicturesToAlbum = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "You must be logged in.",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const {PicturesId, AlbumId} = request.body;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies) {
        try {
            let picture = 0;
            // USer's Album
            let album = await db.Album.findOne({
                where : {id: AlbumId, UserId: user_from_cookies.id},
                include: [db.Picture]
            });

            if (album && PicturesId) {
                for (let i = 0; i < PicturesId.length; i++) {
                    picture += await db.Picture.update(
                        {
                            AlbumId,
                            updatedAt : Date.now()
                        },
                        { where: { id: PicturesId[i] }}
                    );
                }

                // The updated Picture
                if (picture > 0) {
                    data.status = 202;
                    data.message = "Pictures updated successfly";
                }
            } else {
                data.message ='You are not the owner of those pictures';
            }

        }catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Delete a picture belons to the curent User 's album
 * @param request
 * @param response
 */
exports.deletePicture = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "You cannot delete this picture",
        data: null,
        status: 401
    }

    const  {id} = request.params;
    const user_from_cookies = checkUser(request);

    if (user_from_cookies) {
        try {
            let picture = await findOneById(id, user_from_cookies.id);

            let result = await db.Picture.destroy(
                {
                    where: {id},
                    include: [{
                        model: db.Album,
                        as: 'album',
                        where: {
                            UserId: user_from_cookies.id,
                        },
                        required: true
                    }]
                });

            if (result !== 0) {
                if (picture.filename) {
                    removeFile(picture.filename);
                }
                data.message = "Picture was deleted successfully";
                data.status = 200;
            }
        } catch (e) {
            data.message = String(e);
        }
    }
    response.status(data.status).json(data);
}

/**
 * Get all the pictures of the current user
 * @param request
 * @param response
 */
exports.searchPicture = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "Not found",
        data: null,
        status: 404
    }

    const user_from_cookies = checkUser(request);

    if (user_from_cookies) {
        try {
            const {filename, description} = request.query;
            let pictures = await db.Picture.findAll({
                where: {
                    [Op.or]: [
                        {
                            filename: {
                                [Op.like]: `%${filename}%`
                            }
                        },
                        {
                            description: {
                                [Op.like]: `%${description}%`
                            }
                        }
                    ]
                },
                include: [{
                    model: db.Album,
                    as: 'album',
                    where: {
                        UserId: user_from_cookies.id,
                    },
                    required: true
                }]
            });
            if (pictures.length > 0) {
                data.status = 200;
                data.message = "Pictures found";
                data.data = pictures;
            }
        } catch (e) {
            data.message = String(e);
        }
    }

    response.status(data.status).json(data);
}

/**
 * Helper for Stopping DRY
 * @param id
 * @param UserId
 */
const findOneById = async function (id : number, UserId: string) : Promise<any> {
    return  await db.Picture.findOne({
        where : {id},
        include: [
            {
                model: db.Album, as: 'album',
                where: {
                    UserId
                }
            },
            {
                model: db.Tag
            }
        ]
    });
}
