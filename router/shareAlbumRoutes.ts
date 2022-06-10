import express from "express";
const router = express.Router();
const shareAlbumController  = require("../controllers/shareAlbumController");

/**
 * @swagger
 * components:
 *  schemas:
 *   ShareAlbum:
 *       type : object
 *       properties :
 *        UserId :
 *         type : string
 *         description : User's id
 *         example: 1
 *        AlbumId :
 *         type : integer
 *         description : The id of the Album to share
 *         example: 1
 */

/**
 * @swagger
 * /sharealbums:
 *  get:
 *   summary: "Return all Shared Albums of the current user"
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/ShareAlbum'
 *    404:
 *     description: "Not found"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/").get(shareAlbumController.getAllShareAlbum);

/**
 * @swagger
 * /sharealbums:
 *  post:
 *   summary: "The current User Share only albums that has access"
 *   description:
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        PictureId:
 *         type: integer
 *         description: The id of the Album to share
 *         required: true
 *         example: 1
 *        UsersId:
 *         type: array
 *         description: The id of the Users to share
 *         required: true
 *         example: [1,2,3]
 *   responses:
 *    201:
 *     description: "Congratulations ! You shared your album"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    401:
 *     description: "You have to be logged in | You already shared this picture this User"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/").post(shareAlbumController.shareAlbum);

/**
 * @swagger
 * /sharealbums:
 *  delete:
 *   summary: "Delete a sharePicture"
 *   description: "Delete a sharePicture"
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        UserId:
 *         type: string
 *         description: User's id
 *         required: true
 *         example: "8465-5465-5465-5465-5465"
 *        PictureId:
 *         type: integer
 *         description: The id of the Picture to delete from the sharePicture
 *         required: true
 *         example: 1
 *   responses:
 *    201:
 *     description: "Picture was unShared"
 *    401:
 *     description: Yo cannot unShare this picture
 */
router.route("/").delete(shareAlbumController.unShareAlbum);

/**
 * @swagger
 * /sharealbums/view/{AlbumId}:
 *  get:
 *   summary: "Return all LikePictures of the current user"
 *   parameters:
 *    - in: path
 *      name: AlbumId
 *      schema:
 *       type: integer
 *       description: The id of the Album to share
 *       required: true
 *       example: 1
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/ShareAlbum'
 *    404:
 *     description: "Not found"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route('/view/:AlbumId').get(shareAlbumController.allUserShareAlbum);

module.exports = router;