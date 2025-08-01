'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.belongsToMany(models.Tag, { through: 'PostTags', foreignKey: 'postId' });
      Post.hasMany(models.Comment, { foreignKey: 'postId' });

    }
    get summary() {
      return this.content.slice(0, 100) + '...';
    }
    static async findByTag(tagName) {
      return await Post.findAll({
        include: { model: sequelize.models.Tag, where: { name: tagName } }
      });
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Title is required' },
        notEmpty: { msg: 'Title is required' }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Content is required' },
        notEmpty: { msg: 'Content is required' }
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Image URL is required' },
        notEmpty: { msg: 'Image URL is required' },
        isUrl: { msg: 'Image URL must be valid' }
      }
    },
    slug: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'Post',
    hooks: {
      beforeCreate: (post) => {
        post.slug = post.title.toLowerCase().split(' ').join('-');
      }
    }
  });
  return Post;
};