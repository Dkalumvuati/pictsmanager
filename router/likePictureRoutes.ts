import express from "express";
const router = express.Router();
const likePictureController  = require("../controllers/likePictureController");

/**
 * @swagger
 * components:
 *  schemas:
 *   LikePicture:
 *       type : object
 *       properties :
 *        UserId :
 *         type : string
 *         description : User's id
 *         example: 1
 *        PictureId :
 *         type : integer
 *         description : The id of the Picture
 *         example: 1
*/

/**
 * @swagger
 * /likepictures:
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
 *         $ref: '#/components/schemas/LikePicture'
 *    401:
 *     description: "You have to be logged in"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    404:
 *     description: "Not pictures found."
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/").get(likePictureController.getLikesPicture)

/**
 * @swagger
 * /likepictures:
 *  post:
 *   summary: "The current User Like only pictures that has access"
 *   description:
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        PictureId:
 *         type: integer
 *         description: The id of the Picture
 *         required: true
 *         example: 1
 *   responses:
 *    202:
 *     description: "Picture liked"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    401:
 *     description: "You have to be logged in"
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/").post(likePictureController.likePicture)

/**
 * @swagger
 * /likepictures/{PictureId}:
 *  delete:
 *   summary: "The current User Unlike a picture"
 *   description: "The current User Unlike a picture"
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: PictureId
 *      schema:
 *       type: integer
 *       description: The id of the
 *       required: true
 *       example: 1
 *   responses:
 *    200:
 *     description: Puctire was deleted successfully
 *    401:
 *     description: "You cannot delete this picture"
 */
router.route("/:PictureId").delete(likePictureController.unLikePicture);

module.exports = router;