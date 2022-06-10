import express from "express";
const router = express.Router();
const sharePictureController  = require("../controllers/sharePictureController");

/**
 * @swagger
 * components:
 *  schemas:
 *   SharePicture:
 *       type : object
 *       properties :
 *        UserId :
 *         type : string
 *         description : User's id
 *         example: 1
 *        PictureId :
 *         type : integer
 *         description : The id of the Picture to share
 *         example: 1
 */

/**
 * @swagger
 * /sharepictures:
 *  get:
 *   summary: "Return all LikePictures of the current user"
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: A successfully response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/SharePicture'
 *    404:
 *     description: "Not found"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/").get(sharePictureController.getAllSharePictures)

/**
 * @swagger
 * /sharepictures:
 *  post:
 *   summary: "The current User Share only pictures that has access"
 *   description:
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        PictureId:
 *         type: integer
 *         description: The id of the Picture to share
 *         required: true
 *         example: 1
 *        UsersId:
 *         type: array
 *         description: The id of the Users to share with
 *         required: true
 *         example: [1,2,3]
 *   responses:
 *    201:
 *     description: "Congratulations ! You shared your picture"
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
router.route("/").post(sharePictureController.sharePicture)

/**
 * @swagger
 * /sharepictures:
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
router.route("/").delete(sharePictureController.unSharePicture);

/**
 * @swagger
 * /sharepictures/view/{PictureId}:
 *  get:
 *   summary: "Return all LikePictures of the current user"
 *   parameters:
 *    - in: path
 *      name: PictureId
 *      schema:
 *       type: integer
 *       description: The id of the Picture
 *       required: true
 *       example: 1
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: A successfully response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/SharePicture'
 *    404:
 *     description: "Not found"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route('/view/:PictureId').get(sharePictureController.allUserSharePicture);

module.exports = router;