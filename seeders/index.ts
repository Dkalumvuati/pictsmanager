import { exit } from "process";
import db from "../models";
import { users } from "./users";
import { pictures } from './pictures';
import { albums } from './albums';

// Execute Seeders's file
const createUsers = () => {

    // TODO - is not working as I want to
    users.map(async user  => {
        let currenUser = await db.User.create(user);

        albums.map(async album  => {
            let currentAlbum = await db.Album.create({...album, UserId: currenUser.id});

            pictures.map(async picture  => {
                await db.Picture.create({...picture, AlbumId : currentAlbum.id});
            });
        });
    });
}

// TODO - if tou want to generate data from ths seeds thne uncomment those line below
// createAlbums();
// createPictures();
createUsers();
