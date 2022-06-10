'use strict';

import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {

  interface AlbumAttributes {
    id: number;
    name:string;
    can_be_shared:boolean;
    description:string;
  }

  class Album extends Model <AlbumAttributes> implements AlbumAttributes {
    id!: number;
    name!: string;
    can_be_shared!: boolean;
    description!: string;
    static associate(models: any) {
      Album.belongsTo(
          models.User, {
            foreignKey: "UserId", as: "user"
          }
      );

      Album.hasMany(models.Picture, {
        foreignKey: 'AlbumId'
      });

    }
  }

  Album.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name field cannot be empty"
        },
        len: [5, 255]
      }
    },
    can_be_shared: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull:false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};