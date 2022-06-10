'use strict';
import { Model, UUIDV4 } from 'sequelize';

// HASH - PASSWORD
const bcrypt = require("bcrypt");
const saltRound = 10;
// ---------------------------------

interface UserAttributes {
  id: string,
  email:string,
  password:string,
  lastname: string,
  firstname:string,
  role:string,
  avatar:string,
  isValidated: boolean,
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model <UserAttributes> implements UserAttributes{
    id!: string;
    email!: string;
    password!: string;
    lastname!: string;
    role!: string;
    firstname!: string;
    avatar!: string;
    isValidated!: boolean;

    static associate(models: any) {
      // define association here
      User.belongsToMany(models.Picture, {
        through: "SharePictures",
        as: "sharePicture"
      });

      User.belongsToMany(models.Picture, {
        through: "LikePictures",
        as: "picturesLiked"
      });

      User.belongsToMany(models.Album, {
        through: "ShareAlbum",
        as: "shareAlbum"
      });

      //OneToMany
      User.hasMany(models.Album,  {
        foreignKey: "UserId"
      });

      // ManyToMany
      // User.belongsToMany(models.Picture, {
      //   through: 'Comments',
      //   as: "comments" // TODO -  doing not finished
      // });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue:UUIDV4,
      allowNull:false,
      primaryKey:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email field cannot be empty"
        },
        isEmail: {
          msg: "This email is not valide"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: "Password field cannot be empty"
        },
        // TODO - to limit password length >= 8 caracters
      },
      set(pass : string) : void {
        this.setDataValue("password", bcrypt.hashSync(pass, saltRound));
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: {
          msg: "Firstname field cannot be empty"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "ROLE_USER"
    },
    avatar: {
      type: DataTypes.STRING
    },
    isValidated: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};