// Upload files
import multer from 'multer';
import * as fs from "fs";
const {checkUser} =  require("../services/checkUser");

const storage = multer.diskStorage({
    destination: function (req :any, file :any, cb: Function) {
        const user_from_cookies = checkUser(req);
        if (user_from_cookies) {
            // TODO : Optimize how to range the folder
            // const user_album_path = `./uploads/${user_from_cookies.id}/${req.body.AlbumId}`;
            const user_album_path = './uploads/' + user_from_cookies.id;
            fs.existsSync(user_album_path) || fs.mkdirSync(user_album_path);
            cb(null, user_album_path);
        }
    },
    filename: function (req: any, file : any, cb : Function) {
        cb(null, file.originalname);
    }
});

const fileFilter = function (req: any, file : any, cb : Function) {
    if (file.mimeType === 'image/jpeg' || file.mimeType === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const multerConfig = multer(
    {
        storage,
        limits : {
            fileSize: 1024 * 1024 * 5
        }
    });

module.exports = {
    multerConfig
}