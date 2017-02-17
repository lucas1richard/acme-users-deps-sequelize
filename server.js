const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));


const db = require('./db');

app.listen(3000, () => {
  console.log('App listening on port 3000');
});

app.get('/', (req, res) => {
  db.User.findAll({
    include: db.Department
  })
  .then(userDepartments => {
    res.render('index', {userDepartments});
  });
});
