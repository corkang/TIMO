const { Model, DataTypes } = require('sequelize');

class CourseReview extends Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        courseName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        courseCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        professor: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        semester: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5,
          },
        },
        grading: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        difficulty: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        exams: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        quiz: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        assignments: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        teamProjects: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        onlineOfflineRatio: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        teachingMethod: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        likeCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        tableName: 'CourseReview',
        modelName: 'courseReview',
        sequelize,
        indexes: [
          {
            fields: ['courseName', 'professor'],
          },
          {
            fields: ['userId'],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    this.hasMany(models.courseReviewLike, {
      foreignKey: 'reviewId',
      as: 'likes',
    });
  }
}

module.exports = CourseReview;
