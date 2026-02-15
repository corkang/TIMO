const { Model, DataTypes } = require('sequelize');

class SpikeEmailLog extends Model {
  static init(sequelize) {
    return super.init(
      {
        lectureCode: DataTypes.STRING,
        lectureName: DataTypes.STRING,
        professor: DataTypes.STRING,
        recipientCount: DataTypes.INTEGER,
        newSeat: DataTypes.STRING,
        success: DataTypes.BOOLEAN,
        errorMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: 'SpikeEmailLog',
        modelName: 'spikeEmailLog',
        updatedAt: false,
        sequelize,
      },
    );
  }
}

module.exports = SpikeEmailLog;