const { Model, DataTypes } = require('sequelize');

class UserLectureGleaningRelation extends Model {
  static init(sequelize) {
    return super.init(
      {
        emailSentCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        tableName: 'UserLectureGleaningRelation',
        modelName: 'userLectureGleaningRelation',
        sequelize,
      },
    );
  }
}

module.exports = UserLectureGleaningRelation;
