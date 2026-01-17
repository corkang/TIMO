const { Op } = require('sequelize');

const { sequelize } = require('../models');

exports.searchWhereClause = (search) => {
  const searchAttributes = ['name', 'professor', 'hakbu', 'code', 'period'];
  return search?.split(',').map((word) => {
    const trimmedWord = word.replace(/\s+/g, '');
    return {
      [Op.and]: {
        [Op.or]: searchAttributes.map((attribute) =>
          sequelize.where(
            sequelize.fn('REPLACE', sequelize.col(attribute), ' ', ''),
            {
              [Op.like]: '%' + trimmedWord + '%',
            }
          )
        ),
      },
    };
  });
};
