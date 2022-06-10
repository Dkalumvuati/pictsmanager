'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {

  interface PictureAttributes {
    id: number,
    filename: string;
    mime:string,
    can_be_shared: boolean,
    description: string
  }

  class Picture extends Model <PictureAttributes> implements PictureAttributes {
    id!: number;
    filename!: string;
    mime!: string;
    can_be_shared!: boolean;
    description!: string;

    static associate(models: any) {

      // Relationship to Album
      Picture.belongsTo(models.Album, {
        foreignKey: "AlbumId", as : "album"
      });

      // ManyToMany
      Picture.belongsToMany(models.User, {
        through: "LikePictures",
      });

      Picture.belongsToMany(models.User, {
        through: "SharePictures",
      });

      Picture.belongsToMany(models.Tag, {
        through: "PictureTags"
      });

      Picture.hasMany(models.Comment, {
        foreignKey: "PictureId"
      });
    }
  }

  Picture.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true
    },
    filename: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        customValidator(value: any) {
          if (value === "") {
            throw new Error("name can't be null");
          }
        }
      }
    },
    mime: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: "Mime field cannot be empty"
        },
        len: [1, 10]
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    can_be_shared: {
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false,
    }
  }, {
    sequelize,
    modelName: 'Picture',
  });
  return Picture;
};