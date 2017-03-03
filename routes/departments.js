const router = require('express').Router();

//why pass db in here? not sure what it buys you.
module.exports = function(db) {
  router.post('/', (req, res) => {
    const name = req.body.departmentName;
    db.models.departments.findOrCreate({ where: { name: name } })
    .then(() => res.redirect('/'))
    .catch(err => {
      res.redirect(`/?err=${err.errors.map(err => err.message.toString())}&department=true`);
    });
  })


  router.delete('/', (req, res) => {
    const id = req.body.departmentId;
    db.models.departments.destroy({ where: { id } })
      .then(() => res.redirect('/'));
  });

  return router;
};
