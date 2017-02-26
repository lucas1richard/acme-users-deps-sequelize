const router = require('express').Router();

module.exports = function(db) {
  router.post('/', (req, res) => {
    const userName = req.body.userName;
    db.models.employees.findOrCreate({ where: { name: userName } })
    .then(() => res.redirect('/'))
    .catch(err => {
      res.redirect(`/?err=${err.errors.map(err => err.message.toString())}&user=true`);
    });
  });

  router.post('/:userId/user_departments/:departmentId', (req, res) => {
    db.models.employees.handleDepartment(req.params.userId, req.params.departmentId, 'addDepartment')
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      err.users = err.errors;
      res.redirect('/', { err });
    });
  });

  router.delete('/:userId/user_departments/:departmentId', (req, res) => {
    db.models.employees.handleDepartment(req.params.userId, req.params.departmentId, 'removeDepartment')
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      err.departments = err.errors;
      res.redirect('/', { err });
    });
  });

  router.delete('/', (req, res) => {
    const id = req.body.userId;
    db.models.employees.destroy({ where: { id } }).then(() => res.redirect('/'));
  });
  return router;
};

