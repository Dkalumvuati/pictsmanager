'use strict';
import { Model } from 'sequelize';

interface SharepictureAttributes {
  UserId: string,
  PictureId: number
}

module.exports = (sequelize: any, DataTypes: any) => {
  class SharePicture extends Model <SharepictureAttributes> implements SharepictureAttributes {
    PictureId!: number;
    UserId!: string;
    static associate(models: any) {
      // define association here
    }
  }

  SharePicture.init({
    UserId: {
      type: DataTypes.STRING,
      primaryKey:true,
      references: {
        model: 'Model.User',
        key: 'id'
      }
    },
    PictureId: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: 'Model.Picture',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'SharePicture',
  });
  return SharePicture;
};