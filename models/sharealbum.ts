'use strict';
import { Model } from 'sequelize';

interface ShareAlbumAttributes {
  UserId: string,
  AlbumId: number
}
module.exports = (sequelize :any, DataTypes:any) => {
  class ShareAlbum extends Model <ShareAlbumAttributes> implements ShareAlbumAttributes  {

    AlbumId!: number;
    UserId!: string;
    static associate(models:any) {
      // define association here
    }
  }
  ShareAlbum.init({
    UserId: {
      type: DataTypes.STRING,
      primaryKey:true,
      references: {
        model: 'Model.User',
        key: 'id'
      }
    },
    AlbumId: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: 'Model.Album',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ShareAlbum',
  });
  return ShareAlbum;
};