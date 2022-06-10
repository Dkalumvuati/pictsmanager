'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize : any, DataTypes : any) => {

  interface TagAttributes {
    id: number;
    label:string;
  }

  class Tag extends Model  <TagAttributes> implements TagAttributes {
    id!: number;
    label!: string;

    static associate(models : any) {
      // define association here
      Tag.belongsToMany(models.Picture, {
        through: "PictureTags",
        as: 'pictures'
      });
    }
  }
  Tag.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Label field cannot be empty"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};