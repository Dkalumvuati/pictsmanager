import express from "express";
const router = express.Router();
const albumController  = require("../controllers/albumController");

/**
 * @swagger
 * components:
 *  schemas:
 *   Album:
 *    type : object
 *    properties :
 *     id :
 *      type : string
 *      description : The auto-generated id of the User
 *     name :
 *      type : string
 *      description : The name of the Album
 *      example: "My first album"
 *     can_be_shared :
 *      type : boolean
 *      description : Whether the Album can be shared or not
 *      example: true
 *     description :
 *      type : string
 *      description : The description of the Album
 *      example: "This is my first album"
 *   CreateAlbum:
 *    properties:
 *     name :
 *      type : string
 *      description : The name of the Album
 *      example: "My first album"
 *     can_be_shared :
 *      type : boolean
 *      description : Whether the Album can be shared or not
 *      example: true
 *     description :
 *      type : string
 *      description : The description of the Album
 *      example: "This is my first album"
 */

/**
 * @swagger
 * /albums:
 *  get:
 *    description: "Return information for Home page"
 *    responses:
 *      '200':
 *          description: A successfully response
 */
router.route("/")
    .get(albumController.getAlbums)

/**
 * @swagger
 * /albums:
 *  post:
 *   summary: "Create a new Album"
 *   description: "Create a new Album"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateAlbum'
 *   responses:
 *    200:
 *     description: Album created
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *              items:
 *                  $ref: '#/components/schemas/Album'
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 */
router.route("/")
    .post(albumController.createAlbum)

/**
 * @swagger
 * /albums/search:
 *  get:
 *   summary: "Return the Pictures of the Album with the given id"
 *   description: "Return the Pictures of the Album with the given id"
 *   parameters:
 *    - in: query
 *      name: name
 *      schema:
 *       type: string
 *       description: The name of the Album
 *       example: "My first album"
 *       required: true
 *   responses:
 *    200:
 *     description: Found
 *     content:
 *      application/json:
 *       schema:
 *        ref: '#/components/schemas/Album'
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *       schema:
 *        ref: '#/components/schemas/Album'
 *        description: Access denied
 *        properties:
 *         message:
 *          type: string
 *          description: The message of the response
 *          example: "Access denied | You have to be admin for this action."
 *    404:
 *     description: "No Album found"
 *     content:
 *      application/json:
 *       schema:
 *        ref: '#/components/schemas/Album'
 *        description: The Album with the given name
 *        properties:
 *         message:
 *          type: string
 *          description: The message of the response
 *          example: "No Album found"
 */
router.route("/search").get(albumController.searchAlbum)

/**
 * @swagger
 * /albums/{id}:
 *  get:
 *   summary: "Return the Album with the given id"
 *   description: "Return the Album with the given id"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      description: The id of the Album
 *      required: true
 *      example: 1
 *   responses:
 *    200:
 *     description: Album found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Album'
 *        description: The Album with the given id
 *        example:
 *         id: 1
 *         name: "My first album"
 *         can_be_shared: true
 *         description: "This is my first album"
 *         UserId: 1
 *         createdAt: "2020-01-01T00:00:00.000Z"
 *         updatedAt: "2020-01-01T00:00:00.000Z"
 *         Pictures: []
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         message:
 *          type: string
 *          description: The message of the response
 *          example: "Access denied | You have to be admin for this action."
 *    404:
 *     description: Album not found
 */
router.route("/:id")
    .get(albumController.getAlbum);

/**
 * @swagger
 * /albums/{id}:
 *  delete:
 *   summary: "Delete the Album with the given id"
 *   description: "Delete the Album with the given id"
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *
 *      description: The id of the Album
 *      required: true
 *      example: 1
 *   responses:
 *    200:
 *     description: Album was deleted successfully
 *    401:
 *     description: Unauthorized
 */
router.route("/:id")
    .delete(albumController.deleteAlbum);

/**
 * @swagger
 * /albums/{id}:
 *  put:
 *   summary: "Update the Album with the given id"
 *   description: "Update the Album with the given id"
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       description: The id of the Album
 *       required: true
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateAlbum'
 *   responses:
 *    201:
 *     description: Album was created successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/Album'
 *    202:
 *     description: Album was updated successfully
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *              items:
 *                  $ref: '#/components/schemas/Album'
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 */
router.route("/:id").put(albumController.updateAlbum);

module.exports = router;
