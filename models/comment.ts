'use strict';
import { Model } from 'sequelize';

interface CommentAttributes {
  id: number,
  UserId: string,
  PictureId: number,
  comment:string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Comment extends Model  <CommentAttributes> implements CommentAttributes{
    id!: number;
    UserId!: string;
    PictureId!: number;
    comment!: string;
    static associate(models: any) {

    }
  }
  Comment.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true
    },
    UserId: {
      type: DataTypes.STRING,
      allowNull: false
      // references: {
      //   model: 'Model.User',
      //   key: 'id'
      // }
    },
    PictureId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
