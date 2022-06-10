const cookieParser = require('cookie-parser');
const cors = require('cors');
import express from  "express";
import session from "express-session";
const {isAuthenticated} =  require("../middlewares/currentUser");
const morgan = require('morgan');

// TODO - Refactor
require('dotenv').config();
import jwt from "jsonwebtoken";
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const app = express();
app.use(require('body-parser').json())
const port = process.env.PORT || 3000;
import db from "../models";

// Swagger
const swaggerUi  = require('swagger-ui-express');
const swaggerJsDOc  = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: "PictsManager API",
        version: "1.0.0",
        decscription: "API specific for PictsManager Mobile Application",
        contact: {
            email: 'duramana.kalumvuati@epitehc.eu'
        }
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }]
};

const options = {
    swaggerDefinition,
    apis: ["./router/*.ts"]
};
const swagger_Specs = swaggerJsDOc(options);
var options_css = {
    customCss: '.swagger-ui .topbar { display: none }'
};
//--------------------------------------------------------------------

// Routes
const userRoutes = require("../router/userRoutes");
const tagRoutes = require("../router/tagRoutes");
const pictureRoutes = require("../router/pictureRoutes");
const albumRoutes = require("../router/albumRoutes");
const likePictureRoutes = require("../router/likePictureRoutes");
const sharePictureRoutes = require("../router/sharePictureRoutes");
const shareAlbumRoutes = require("../router/shareAlbumRoutes");
const commentRoutes = require("../router/commentRoutes");
const secureRoutes = require("../router/secureRoutes");

// Uploaded Files
app.use('/uploads', express.static('uploads'));
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods',['GET', 'POST', 'PUT', 'DELETE']);
    next();
});

app.use(morgan('dev'));
app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));
app.use(cookieParser());
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));

export default function createServer() {
    const database : Function = async () => await db.sequelize.sync();
    database();

        // Routes - Middware
        app.use("/", secureRoutes);
        app.use("/users", isAuthenticated, userRoutes);
        app.use("/pictures",isAuthenticated, pictureRoutes);
        app.use("/albums", isAuthenticated, albumRoutes);
        app.use("/likepictures", isAuthenticated, likePictureRoutes);
        app.use("/sharepictures", isAuthenticated, sharePictureRoutes);
        app.use("/sharealbums", isAuthenticated, shareAlbumRoutes);
        app.use("/comments", isAuthenticated, commentRoutes);
        app.use("/tags", isAuthenticated, tagRoutes);

        // Swagger - Doc
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger_Specs))
        module.exports = app.listen(port, ()=> {
            console.log(`Listening on Server port : ${port}`);
        });

    // Used only for Test
    return app;
}
