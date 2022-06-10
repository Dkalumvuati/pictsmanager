import express from "express";
const router = express.Router();
const pictureController = require("../controllers/pictureController");
const {multerConfig} = require('../middlewares/uploadFile');
const {isAuthenticated} =  require("../middlewares/currentUser");

/**
 * @swagger
 * components:
 *  schemas:
 *   Picture:
 *    type : object
 *    properties :
 *     id :
 *      type : integer
 *      description : the auto-generated id of the Picture
 *      example: 1
 *     filename :
 *      type : string
 *      description : the name of the Picture
 *      example: "picture.png"
 *     mime :
 *      type : string
 *      description : the name of the Picture
 *      example: "picture.png"
 *     can_be_shared :
 *      type : boolean
 *      description : Whether the Picture can be shared or not
 *      example: false
 *     description :
 *      type : string
 *      description : The description of the Picture
 *      example: "This is my first picture"
 *   CreatePicture:
 *    properties:
 *     AlbumId :
 *      type : integer
 *      description : The id of the Album
 *      example: 1
 *      required : false
 *     can_be_shared :
 *      type : boolean
 *      description : Whether the Picture can be shared or not
 *      example: true
 *     description :
 *      type : string
 *      description : The description of the Picture
 *      example: "This is my first picture"
 */

/**
 * @swagger
 * /pictures:
 *  get:
 *    description: "Return all Pictures of the current user"
 *    responses:
 *      '200':
 *          description: A successfully response
 *          content:
 *           application/json:
 *            schema:
 *             type: array
 *             items:
 *              $ref: '#/components/schemas/Picture'
 */
router.route("/").get(pictureController.getPictures);

// TODO - to optimize this function.
// We don't need this to create a new method for this action
// We can use getPictures with checking parameters
/**
 * @swagger
 * /pictures/search:
 *  get:
 *   summary: "Search pictures"
 *   description: "Search pictures"
 *   parameters:
 *    - in: query
 *      name: filename
 *      schema:
 *       type: string
 *       description: The name of the Picture
 *       example: "picture.png"
 *       required: false
 *    - in: query
 *      name: description
 *      schema:
 *       type: string
 *       description: The description of the Picture
 *       example: "This is my first picture"
 *       required: false
 *   responses:
 *    200:
 *     description: Pictures found
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Picture'
 *    401:
 *     description: Unauthorized
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: "Unauthorized"
 *          description: The error message
 *    404:
 *     description: Not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: "Not found"
 *          description: The error message
 *
 */
router.route("/search").get(pictureController.searchPicture);

/**
 * @swagger
 * /pictures/{id}:
 *  get:
 *   summary: "Return a Picture"
 *   description: "Return a Picture"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       description: The id of the Picture
 *       required: true
 *       example: 1
 *   responses:
 *    200:
 *     description: Picture found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Picture'
 *        description: The Picture with the given id
 *        example:
 *         id: 1
 *         filename: "picture.png"
 *         mime: "image/png"
 *         can_be_shared: true
 *         description: "This is my first picture"
 *         AlbumId: 1
 *         Tags: []
 *         Comments: []
 *         createdAt: "2020-05-01T00:00:00.000Z"
 *         updatedAt: "2020-05-01T00:00:00.000Z"
 *    404:
 *     description: Album not found | No Picture with this Id
 */
router.route("/:id").get(pictureController.getPicture)

/**
 * @swagger
 * /pictures:
 *  post:
 *   summary: "Create a new Picture"
 *   description: "Create a new Picture"
 *   parameters:
 *    - in: formData
 *      name: filename
 *      schema:
 *       type: file
 *       description: The file of the Picture
 *       required: true
 *       example: "picture.png"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreatePicture'
 *   responses:
 *    200:
 *     description: Picture created
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *              items:
 *                  $ref: '#/components/schemas/Picture'
 *    401:
 *     description: You are not allowed to create a picture
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 */
router.route("/").post(multerConfig.single('filename'), pictureController.createPicture);

/**
 * @swagger
 * /pictures/remove:
 *  post:
 *   summary: Remove pictures from an album
 *   description: Remove pictures from an album but an default album is created if the album is empty with the pictures
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        PicturesId:
 *         type: array
 *         description: The id of the pictures to remove from the album
 *         required: true
 *         example: [1, 2, 3]
 *        AlbumId:
 *         type: integer
 *         description: The id of the album from which the pictures will be removed
 *         required: true
 *         example: 1
 *   responses:
 *    202:
 *     description: Picture updated successfly
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *              items:
 *                  $ref: '#/components/schemas/Album'
 *    401:
 *     description: You must be logged in.
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 */
router.route("/remove").post(pictureController.getRemovePicturesFromAlbum)

/**
 * @swagger
 * /pictures/move:
 *  post:
 *   summary: Move pictures to an album
 *   description: Move pictures to an album
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        PicturesId:
 *         type: array
 *         description: The id of the pictures to remove from the album
 *         required: true
 *         example: [1, 2, 3]
 *        AlbumId:
 *         type: integer
 *         description: The id of the album where the pictures will be moved
 *         required: true
 *         example: 1
 *   responses:
 *    202:
 *     description: Picture updated successfly
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *              items:
 *                  $ref: '#/components/schemas/Album'
 *    401:
 *     description: You must be logged in. | You are not the owner of those pictures
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 */
router.route("/move").post(pictureController.getMovePicturesToAlbum)

/**
 * @swagger
 * /pictures/{id}:
 *  delete:
 *   summary: "Delete a Picture"
 *   description: "Delete a Picture"
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       description: The id of the Album
 *       required: true
 *       example: 1
 *   responses:
 *    200:
 *     description: Puctire was deleted successfully
 *    401:
 *     description: "You cannot delete this picture"
 */
router.route("/:id").delete(pictureController.deletePicture)

// TODO - to fix this route for Swagger
/**
 * @swagger
 * /pictures/{id}:
 *  put:
 *   summary: "Update a Picture"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      description: The id of the Picture
 *      required: true
 *      example: 1
 *    - in: formData
 *      name: filename
 *      required: false
 *      schema:
 *       type: file
 *      description: The new filename of the Picture
 *      example: 'picture.jpeg'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreatePicture'
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    202:
 *     description: Picture updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/Picture'
 *    401:
 *     description: "You cannot update this picture"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/:id").put(multerConfig.single('filename'), pictureController.updatePicture);

module.exports = router;