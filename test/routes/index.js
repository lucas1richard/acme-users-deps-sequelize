const db = require('../../db');
const chalk = require('chalk');
const app = require('../../server');
const agent = require('supertest')(app);

const employeeName = 'HelloTest';

describe('routes', () => {
  describe('GET /', () => {
    it('gets 200 on index', done => {
      agent.get('/').expect(200, done);
    });
  });
  describe('POST /users', () => {
    beforeEach(done => {
      db.models.employees
      .destroy({ where: {name: employeeName} })
      .then(done);
    });
    afterEach(done => {
      db.models.employees
      .destroy({ where: {name: employeeName} })
      .then(() => { done(); });
    });
    it('creates a new user', done => {
      agent.post('/users')
      .type('form')
      .send({ userName: employeeName })
      .expect(302)
      .end(() => {
        console.log(chalk.dim('Checking for the employee in the database'));
        db.models.employees.findOne({ where: {name: employeeName} })
        .then(emp => {
          if (emp) {
            console.log(chalk.blue('The employee was found'));
            done();
          } else {
            done(new Error('The employee was not found'));
          }
        })
        .catch(err => { done(err); });
      });
    });
  });
});
