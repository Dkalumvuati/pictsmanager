import {Sequelize, Op } from "sequelize";
import db from "../models";
const {checkUser} =  require("../services/checkUser");

exports.getTags = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "Success",
        data: null,
        status: 200
    }

    try {
        data.data = await db.Tag.findAll();
    } catch (e) {
        data.message = String(e);
        data.status = 401;
    }
    response.json(data).status(200);
}

exports.getTag = async function(request :any , response : any) : Promise<any>
{
    let data = {
        message: "No tag found",
        data: null,
        status: 404
    }

    const  {id} = request.params;
    try {
        // TODO - Return Tags shared by other user
        let result = await db.Tag.findOne({
            where : { id },
            include: [{
                model: db.Picture,
                as: 'pictures',
                // attributes: ['id']
            }]
        });

        if (result && result.length !== 0) {
            data.data = result;
            data.message = "Success";
            data.status = 200;
        }
    }catch (e) {
        // TODO - do nothing
        data.message = String(e);
    }
    response.status(data.status).json(data);
}

exports.createTag = async function(request : any, response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "You have to be admin for this action.",
        data: null,
        status: 401
    }

    const user_from_cookies = checkUser(request);
    // TODO - to Add role for admin
    if (user_from_cookies && user_from_cookies?.role === "ROLE_ADMIN") {
        const  {label} = request.body;
        try {
            const user = await db.User.findOne({
                where: {
                    id: user_from_cookies.id
                }
            });

            if (user) {
                data.data = await db.Tag.create({
                    label,
                    UserId: user.id
                });
                data.status = 201;
                data.message = "Tag created";
            }
        }catch (e : any) {
            // TODO - to activate for Prod
            //data.message = String("Oops!, We found some error on create a new Tag. Check fields before to try again.");  //Message for  Prod
            data.message = String(e.message); // For dev
            data.status = 401;
        }
    }

    response.json(data).status(data.status);
}

exports.updateTag = async function(request : any, response : any) : Promise<any>
{
    let data = {
        message: "Error on updating Tag",
        data: null,
        status: 401
    }

    // TODO - Check empty content, injection DOS and other things
    const {id} = request.params;
    const {label} = request.body;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies && user_from_cookies?.role === 'ROLE_ADMIN') {
        try {
            let tag = await db.Tag.findOne({ where : { id } });
            if (tag) {
                let result = await db.Tag.update(
                    {
                        label,
                        updatedAt : Date.now()
                    },
                    { where: { id: tag.id }}
                );
                if (result && result.length !== 0) {
                    data.data = await db.Tag.findOne({where: {id }});
                    data.message = "Tag updated successfuly";
                    data.status = 200;
                }
            } else  {
                let result = await db.Tag.create({
                    label,
                    UserId: user_from_cookies.id
                });
                if (result) {
                    data.data = result;
                    data.status = 201;
                    data.message = "Tag created";
                }
            }
        }catch (e) {
            data.message = String(e);
        }
    }
    response.status(data.status).json(data);
}

exports.deleteTag = async function(request : any , response : any) : Promise<any>
{
    // TODO - to refactor
    let data = {
        message: "You cannot delete this Tag",
        data: null,
        status: 401
    }

    const {id} = request.params;
    const user_from_cookies = checkUser(request);
    if (user_from_cookies && user_from_cookies?.role === 'ROLE_ADMIN') {
        try {
            let result = await db.Tag.destroy({ where: { id }});
            if (result !== 0) {
                data.message = "Tag was deleted successfuly";
                data.status = 200;
            }
        } catch (e) {
            data.message = String(e);
            data.status = 404;
        }
    }

    response.status(data.status).json(data);
}
