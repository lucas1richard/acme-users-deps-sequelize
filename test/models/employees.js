const { expect } = require('chai');
const db = require('../../db');
const chalk = require('chalk');

describe('employees model', () => {
  describe('creating a new employee', () => {

    let tests = [
      { paren: 'not null', obj: {name: null}},
      { paren: 'min length 2', obj: {name: 'Do'}},
      { paren: 'letters only', obj: {name: '_Hello12'}},
    ];

    tests.forEach(test => {
      it(`requires a name (${test.paren})`, done => {
        db.models.employees.create(test.obj)
        .catch(err => {
          console.log(chalk.magenta(err.errors[0].message));
          done();
        });
      });
    });
    it('has no problem otherwise', done => {
      db.models.employees.destroy({ where: {name: 'Dazzle'} })
      .then(() => db.models.employees.create({ name: 'Dazzle' }))
      .then(dep => {
        console.log(chalk.blue(dep.name));
        done();
      })
      .catch(err => done(err));
    });
  });
  describe('associations', () => {
    it('is associated to departments', done => {
      db.models.employees.findOrCreate({ where: { name: 'Razzle' } })
      .then(deps => {
        if (deps[0].hasDepartments) {
          done();
        }
      })
      .catch(err => done(err));
    });
  });
});
