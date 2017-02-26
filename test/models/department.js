// const { expect } = require('chai');
const db = require('../../db');
const chalk = require('chalk');

describe('departments model', () => {
  describe('creating a new department', () => {
    it('has a unique name', done => {
      db.models.departments.create({ name: 'Embarrassing' })
      .then(() => db.models.departments.create({ name: 'Embarrassing' }))
      .catch(err => {
        console.log(chalk.magenta(err.errors[0].message));
        done();
      });
    });

    let tests = [
      { paren: 'not null', obj: {name: null}},
      { paren: 'min length 2', obj: {name: 'D'}},
      { paren: 'letters only', obj: {name: '_Hello12'}},
    ];

    tests.forEach(test => {
      it(`requires a name (${test.paren})`, done => {
        db.models.departments.create(test.obj)
        .catch(err => {
          console.log(chalk.magenta(err.errors[0].message));
          done();
        });
      });
    });
    it('has no problem otherwise', done => {
      db.models.departments.destroy({ where: {name: 'QA'} })
      .then(() => db.models.departments.create({ name: 'QA' }))
      .then(dep => {
        console.log(chalk.blue(dep.name));
        done();
      })
      .catch(err => done(err));
    });
  });
  describe('associations', () => {
    it('is associated to employees', done => {
      db.models.departments.findOrCreate({ where: { name: 'IT' } })
      .then(deps => {
        if (deps[0].hasEmployees) {
          done();
        }
      })
      .catch(err => done(err));
    });
  });
});
