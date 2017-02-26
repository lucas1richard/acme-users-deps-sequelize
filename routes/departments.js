const router = require('express').Router();

module.exports = function(db) {
  router.post('/', (req, res) => {
    const departmentName = req.body.departmentName;
    db.models.departments.findOrCreate({ where: { name: departmentName } })
    .then(() => res.redirect('/'))
    .catch(err => {
      res.redirect(`/?err=${err.errors.map(err => err.message.toString())}&department=true`);
    });
  })


  router.delete('/', (req, res) => {
    const id = req.body.departmentId;
    db.models.departments.destroy({ where: { id } }).then(() => res.redirect('/'));
  });

  return router;
};
