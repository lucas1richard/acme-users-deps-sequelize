const { Sequelize, db } = require('./db');

const User = require('./user')(Sequelize, db);
const Department = require('./department')(Sequelize, db);

const UserDepartments = db.define('user_departments', {});

User.belongsToMany(Department, { through: UserDepartments, foreignKey: 'user_id' });
Department.belongsToMany(User, { through: UserDepartments, foreignKey: 'department_id' });


db.sync({ force: true }).then(() => {
  User.bulkCreate([{ name: 'Prof' }, { name: 'Mitch' }])
  .then(() => Department.bulkCreate([{ name: 'IT'}, { name: 'HR' }, { name: 'Executive' }]))
  .then(() => UserDepartments.bulkCreate([
    { user_id: 1, department_id: 1 },
    { user_id: 2, department_id: 2 },
    { user_id: 1, department_id: 3 },
   ]))
  .then(() => {
    console.log('Database Synced');
  });
});

module.exports = {
  db,
  User,
  Department
};
