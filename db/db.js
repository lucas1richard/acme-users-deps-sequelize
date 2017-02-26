const Sequelize = require('sequelize');

const database = process.env.DATABASE || 'acme_users_and_departments';
console.log(database);
const sequelize = new Sequelize(database, null, null, {
  logging: false,
  dialect: 'postgres'
});

// const sequelize = new Sequelize('postgres://localhost/acme_users_and_departments', {
//   logging: false
// });

module.exports = sequelize;
