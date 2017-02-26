module.exports = (sequelize, DataTypes) => sequelize.define('departments', {
  name: {
    type: DataTypes.STRING,
    validate: {
      isAlpha: { args: true, msg: 'Characters other than letters are not allowed'},
        len: { args: [2, 100], msg: 'Department name length must be greater than 1 and less than 100' }
    },
    allowNull: false,
    unique: true
  }
});
