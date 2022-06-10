import express from "express";
const router = express.Router();
const commentController  = require("../controllers/commentController");

/**
 * @swagger
 * components:
 *  schemas:
 *   Comment:
 *    type : object
 *    properties :
 *     id :
 *      type : integer
 *      description : the auto-generated id of the Comment
 *     PictureId :
 *      type : integer
 *      description : 'the id of the Picture that is commented'
 *      example: 1
 *     comment :
 *      type : string
 *      description : 'the comment'
 *      example: 'This is my first comment'
 *   UpdateComment:
 *    properties:
 *     PictureId :
 *      type : integer
 *      description : 'the id of the Picture that is commented'
 *      example: 1
 *     comment :
 *      type : string
 *      description : 'the comment'
 *      example: 'This is my first comment'
 */

/**
 * @swagger
 * /comments/picture/{PictureId}:
 *  get:
 *   summary: "Return information for a Picture"
 *   description: "Return information for a Picture"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      description: The id of the Picture
 *      required: true
 *      example: 1
 *   responses:
 *    200:
 *     description: Picture's information
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *        description: The description of the Picture
 *        example:
 *         id: 1
 *         PictureId: 1
 *         UserId: 1
 *         comment: "This is my first comment"
 *         createdAt: "2020-01-01T00:00:00.000Z"
 *         updatedAt: "2020-01-01T00:00:00.000Z"
 *    404:
 *     description: Album not found
 */
router.route("/picture/:PictureId").get(commentController.getCommentsByPictureId);

/**
 * @swagger
 * /comments/{id}:
 *  get:
 *   summary: "Return information about a comment"
 *   description: "Return information about a comment"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      description: The id of the Comment
 *      required: true
 *      example: 1
 *   responses:
 *    200:
 *     description: Comment's information
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *        description: The description of the Comment
 *        example:
 *         id: 1
 *         PictureId: 1
 *         UserId: 1
 *         comment: "This is my first comment"
 *         createdAt: "2020-01-01T00:00:00.000Z"
 *         updatedAt: "2020-01-01T00:00:00.000Z"
 *    404:
 *     description: Album not found
 */
router.route("/:id").get(commentController.getComment);

/**
 * @swagger
 * /comments/picture/{PictureId}:
 *  post:
 *   summary: "Return information for a comment"
 *   description: "Return information for a comment"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        comment:
 *         type: string
 *         description: 'the comment'
 *         required: true
 *         example: 'This is my first comment'
 *   parameters:
 *    - in: path
 *      name: PictureId
 *      schema:
 *       type: integer
 *      description: The id of the Picture
 *      required: true
 *      example: 1
 *   responses:
 *    201:
 *     description: Comment's information
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *        description: The description of the Comment
 *        example:
 *         id: 1
 *         PictureId: 1
 *         UserId: 1
 *         comment: "This is my first comment"
 *         createdAt: "2020-01-01T00:00:00.000Z"
 *         updatedAt: "2020-01-01T00:00:00.000Z"
 *    401:
 *     description: "This action requires connection | You are allowed to comment this picture"
 */
router.route("/picture/:PictureId").post(commentController.setComment);

/**
 * @swagger
 * /comments/{id}:
 *  put:
 *   summary: "Update a comment"
 *   description: "Update a comment"
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        comment:
 *         type: string
 *         description: 'the comment'
 *         required: true
 *         example: 'This is my first comment'
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      description: The id of the Comment
 *      required: true
 *      example: 1
 *   responses:
 *    201:
 *     description:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *        description: The description of the Comment
 *        example:
 *         id: 1
 *         PictureId: 1
 *         UserId: 1
 *         comment: "This is my first comment"
 *         createdAt: "2020-01-01T00:00:00.000Z"
 *         updatedAt: "2020-01-01T00:00:00.000Z"
 *    401:
 *     description: "Comment not found"
 */
router.route("/:id").put(commentController.updateComment);

/**
 * @swagger
 * /comment/{id}:
 *  delete:
 *   summary: "Delete a comment"
 *   description: "Delete a comment"
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      description: The id of the Comment
 *      required: true
 *      example: 1
 *   responses:
 *    200:
 *     description: "Comment deleted successfully"
 *    401:
 *     description: "This acation requires to be connected|You cannot delete a comment that does not exist"
 */
router.route("/:id").delete(commentController.deleteComment);

module.exports = router;