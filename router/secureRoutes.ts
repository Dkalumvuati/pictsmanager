import express from "express";
const router = express.Router();
const secureController  = require("../controllers/secureController");
const {isAuthenticated} =  require("../middlewares/currentUser");
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
 *         example: 'https://domail.ext/avatar.jpg'
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
 * /:
 *  get:
 *    summary: This is the root route of the API
 *    description: "Return information for Home page"
 *    responses:
 *      '200':
 *          description: A successful response
 *          content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *              message:
 *               type: string
 *               description: "Welcome on API - PictsManager"
 *               example: "Welcome on API - PictsManager"
 */
router.get('/',secureController.getHome);

/**
 * @swagger
 * /users/validate_email/{id}:
 *  get:
 *    description: "Once a User's account created, this once has to validate email"
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       description: "User's id"
 *       required: true
 *       example: "4654-454654-546546-ere-e"
 *    responses:
 *      '200':
 *          description: 'Your account is already validated.'
 *      '202':
 *          description: 'Congratulation ! Your account is now validated.'
 *      '401':
 *          description: 'Error on validate your email.'
 */
router.route("/users/validate_email/:id")
    .get(secureController.validateEmail);

/**
 * @swagger
 * /users/me:
 *  get:
 *   summary: Returns the current User connected
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
 *    401:
 *     description: Error. When user is not logged in
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 */
router.route("/users/me")
    .get(isAuthenticated, secureController.getMe);

// TODO - upload file doesn't work
/**
 * @swagger
 * /users/edit:
 *  put:
 *    description: "Once a User's account created, this once has to validate email"
 *    consumes:
 *     - multipart/form-data
 *    parameters:
 *     - in: formData
 *       name: avatar
 *       type: file
 *       description: "User's avatar"
 *       required: false
 *       example: "avatar.jpg"
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         password:
 *          type: string
 *          description: User's Password
 *          example: 'strong password more than 8 characters'
 *          required: false
 *         firstname:
 *          type: string
 *          description: User's firstname
 *          example: 'John'
 *          required: false
 *         lastname:
 *          type: string
 *          description: User's lastname
 *          example: 'Doe'
 *          required: false
 *         avatar:
 *          type: file
 *          description: User's avatar
 *          example: 'avatar.jpg'
 *          required: false
 *    responses:
 *      '202':
 *          description: "User's infos were updated"
 *      '401':
 *          description: "Impossible to update this user's file"
 */
router.route("/users/edit").put(multerConfig.single('avatar'), secureController.updateUser);

/**
 * @swagger
 * /login:
 *  post:
 *   summary: Log in User
 *   description: Login for only User who has registered before
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Login'
 *   responses:
 *    200:
 *     description: User's information when log in was successfully
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *              items:
 *                  $ref: '#/components/schemas/User'
 *    401:
 *     description: Error. When email and password are wrong
 *     content:
 *      application/json:
 *          schema:
 *              type: object
 *    404:
 *        description: Error. When any other error
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 */
router.route("/login").post(secureController.login);

/**
 * @swagger
 * /logout:
 *  post:
 *      summary: Once User connected, Has a possibility to logout. Of course with token
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: User's information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/Message'
 *          401:
 *              description: Error. When user is not logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: Error. Error from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */
router.route("/logout").post(isAuthenticated, secureController.logout);

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Create an account
 *      description: When the visitor want to create an account
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Register'
 *      responses:
 *          201:
 *              description: User's information on create an account
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          401:
 *              description: 'If you have a valide account, an email will be sent to you !'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */
router.route("/register").post(secureController.register);

/**
 * @swagger
 * /reset:
 *  post:
 *      summary: Reset password
 *      description: 'If you have a valide account, an email will be sent to you !'
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Reset'
 *      responses:
 *          201:
 *              description: User's information on create an account
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/Reset'
 *          401:
 *              description: 'If you have a valide account, an email will be sent to you !'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */
router.route("/reset").post(secureController.reset);

/**
 * @swagger
 * /reset/{id}:
 *  post:
 *      summary: Reset password handler
 *      description: It sends uri to the User's email in the order to reset password
 *      parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *          description: "User's id"
 *          required: true
 *      requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schemas/ResetHandler'
 *      responses:
 *          201:
 *              description: 'Your password was changed successfully'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          401:
 *              description: 'Error on changing User password'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */
router.route("/reset/:id").post(secureController.resetHandler);

/**
 * @swagger
 * /unRegister:
 *  delete:
 *      summary: Delete a User's account
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: User's information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/Message'
 *          401:
 *              description: Error. When user is not logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: Error. Error from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */
router.route("/unRegister").delete(isAuthenticated, secureController.unRegister);

module.exports = router;