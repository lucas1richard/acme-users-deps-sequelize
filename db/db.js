const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/acme_users_and_departments', {
  logging: false
});

module.exports = {
  db,
  Sequelize
};
