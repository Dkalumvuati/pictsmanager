'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes : any) => {

  interface PictureTagsAttributes {
    PictureId: number,
    TagId: number
  }

  class PictureTags extends Model <PictureTagsAttributes> implements PictureTagsAttributes {
    PictureId!: number;
    TagId!: number;

    static associate(models: any) {
      // define association here
    }
  }
  PictureTags.init({
    TagId: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: 'Model.Tag',
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
    modelName: 'PictureTags',
  });
  return PictureTags;
};