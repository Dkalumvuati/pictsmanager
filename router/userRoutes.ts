import express from "express";
const router = express.Router();
const userController  = require("../controllers/userController");
const {multerConfig} = require('../middlewares/uploadFile');

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *       type : object
 *       properties :
 *        id :
 *         type : string
 *         description : The auto-generated id of the User
 *        email :
 *         type : string
 *         description : User's email that allow User to log in with password
 *         example: 'john.doe@domain.ext'
 *        lastname :
 *         type : string
 *         description : User's lastname
 *         example: 'Doe'
 *        firstname :
 *         type : string
 *         description : Firstname of User. Required on Sign Up
 *         example: JOHN
 *        role :
 *         type : string
 *         description : The role of User. There are [ROLE_USER, ROLE_ADMIN]
 *        avatar :
 *         type : string
 *         description : Uri of User's avatar
 *         example: 'https://domail.ext/avatar.jpeg'
 *        isValidated :
 *         type : boolean
 *         description : Controller of User's status
 *         example : true | false
 *   Login:
 *    type : object
 *    properties :
 *     email :
 *      type : string
 *      description : User's email that allow User to log in with password
 *      example: 'john.doe@domain.ext'
 *     password :
 *      type : string
 *      description : User's Password
 *      example: 'strong password more than 8 characters'
 *   Register:
 *    type : object
 *    properties :
 *     firstname :
 *      type : string
 *      description : New User firstname
 *      example: 'JOHN'
 *     email :
 *      type : string
 *      description : User's email that allow User to log in with password
 *      example: 'john.doe@domain.ext'
 *     password :
 *      type : string
 *      description : User's Password
 *      example: 'strong password more than 8 characters'
 *   Reset:
 *    type : object
 *    properties :
 *     email :
 *      type : string
 *      description : User's email where uri with be sent
 *      example: 'john.doe@domain.ext'
 *   ResetHandler:
 *    type : object
 *    properties :
 *     password :
 *      type : string
 *      description : Once email is send and clicked on. User will be redirected to this page in the order to reset his/her password
 *      example: 'String password'
 *   Message:
 *    type : object
 *    properties :
 *     message :
 *      type : string
 *      description : Return message to informe User for every action done
 *      example: 'You are already logged in'
 *     data :
 *      type : object
 *      description : Can be User | Album | ect
 *      example: "{id: 1, email: emain@dimain.ext, ect}"
 */

/**
 * @swagger
 * /users/admin:
 *  get:
 *   summary: "Return all users"
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: User's information
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/User'
 *    404:
 *     description: Users not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/admin")
    .get(userController.getUsers);

/**
 * @swagger
 * /users/admin/{id}:
 *  put:
 *   summary: "Return all users"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      description: The id of the Album
 *      required: false
 *      example: '366c02f1-2a9d-4607-aed6-03ba7b590a27'
 *    - in: formData
 *      name: avatar
 *      schema:
 *       type: file
 *      description: User's avatar
 *      required: true
 *      example: 'avatar.jpeg'
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    202:
 *     description: User's information
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/User'
 *    401:
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/admin/:id")
    .put(multerConfig.single('avatar'), userController.updateUser);

/**
 * @swagger
 * /users/admin:
 *  post:
 *   summary: "Return an user"
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: User's information
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/User'
 *    404:
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/admin")
    .post(userController.createUser);

/**
 * @swagger
 * /users/admin/{id}:
 *  get:
 *   summary: "Return an user"
 *   description: "Return an user"
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      description: The id of the User
 *      required: true
 *      example: '366c02f1-2a9d-4607-aed6-03ba7b590a27'
 *   responses:
 *    200:
 *     description: User's information
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *        description: User's information
 *        example:
 *         id: '366c02f1-2a9d-4607-aed6-03ba7b590a27'
 *         email: 'example@domain.fr'
 *         lastname: 'Doe'
 *         firstname: 'John'
 *         role: 'ROLE_USER'
 *         avatar: 'https://domain.ext/avatar.jpeg'
 *         isValidated: true
 *         createdAt: '2020-01-01T00:00:00.000Z'
 *         updatedAt: '2020-01-01T00:00:00.000Z'
 *    404:
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/admin/:id")
    .get(userController.getUser);

/**
 * @swagger
 * /users/admin/{id}:
 *  delete:
 *   summary: "Delete an user"
 *   description: "Delete an user"
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      description: The id of the User
 *      required: true
 *      example: 1
 *   responses:
 *    200:
 *     description: User was deleted
 *    401:
 *     description: "Yo cannot delete this user"
 */
router.route("/admin/:id")
    .delete(userController.deleteUser);

module.exports = router;