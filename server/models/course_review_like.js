const { Model, DataTypes } = require('sequelize');

class CourseReviewLike extends Model {
  static init(sequelize) {
    return super.init(
      {
        reviewId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: 'CourseReviewLike',
        modelName: 'courseReviewLike',
        sequelize,
        indexes: [
          {
            unique: true,
            fields: ['reviewId', 'userId'],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.courseReview, {
      foreignKey: 'reviewId',
      targetKey: 'id',
    });
    this.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }
}

module.exports = CourseReviewLike;
