'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Post, { through: 'PostTags', foreignKey: 'tagId' });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Tag name is required' },
        notEmpty: { msg: 'Tag name is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};