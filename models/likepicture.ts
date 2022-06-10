'use strict';
import { Model } from 'sequelize';

interface LikepictureAttributes {
  UserId: string,
  PictureId: number
}

module.exports = (sequelize :any, DataTypes : any) => {
  class LikePicture extends Model <LikepictureAttributes> implements LikepictureAttributes {
    PictureId!: number;
    UserId!: string;

    static associate(models : any) {
      // define association here
    }
  }
  LikePicture.init({
    UserId: {
      type: DataTypes.STRING,
      primaryKey:true,
      references: {
        model: 'Model.User',
        key: 'id'
      },
      validate: {
        notEmpty: {
          msg: "UserDi field cannot be empty"
        },
      }
    },
    PictureId: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: 'Model.Picture',
        key: 'id'
      },
      validate: {
        notEmpty: {
          msg: "PictureID field cannot be empty"
        }
      },
    }
  }, {
    sequelize,
    modelName: 'LikePicture',
  });
  return LikePicture;
};