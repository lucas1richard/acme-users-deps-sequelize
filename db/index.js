const sequelize = require('./db');

const seed = process.env.SEED || false;
const seedConfig = seed ? { force:true } : {};

const Employee = sequelize.import('./employee');//cool!
const Department = sequelize.import('./department');
const chalk = require('chalk');

Employee.belongsToMany(Department, { through: 'user_departments', foreignKey: 'user_id' });
Department.belongsToMany(Employee, { through: 'user_departments', foreignKey: 'department_id' });

sequelize.sync(seedConfig).then(() => {
  if (seed) {

    const startTime = new Date();
    console.log(chalk.magenta.bold('Syncing the database'));

    let departments;
    console.log(chalk.blue(' - Seeding employees table'));
    Employee.bulkCreate([{ name: 'Prof' }, { name: 'Mitch' }])
    .then(() => {

      console.log(chalk.blue(' - Seeding departments table'));
      return Department.bulkCreate([{ name: 'IT'}, { name: 'HR' }, { name: 'Executive' }]);

    })
    .then(() => Department.findAll({}))
    .then(_departments => {

      departments = _departments;
      return Employee.findAll({});

    })
    .then(employees => {

      console.log(chalk.blue(' - Adding departments to employees'));
      console.log('----------------------------------');
      return employees[0].addDepartments([departments[0], departments[2]]);
    })
    .then(() => {

      const totalTime = (new Date() - startTime) / 1000;
      console.log(chalk.yellow('Database Seeded') + ' ' + chalk.dim(`(${totalTime} seconds)`));

    });
  }
});

module.exports = sequelize;
