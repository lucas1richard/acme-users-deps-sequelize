const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const chalk = require('chalk');
const app = express();

// Define the view engine with partials and helpers
let hbs = handlebars.create({
  defaultLayout: 'main',
  helpers: {},
  cache: false,
  partialsDir: [ 'views/partials/' ]
});

app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const db = require('./db');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(chalk.yellow.bold(`Server is listening on port ${port}`)));

app.get('/', (req, res) => {
  let allDepartments, employees;
  db.models.departments.findAll({}) // Get all departments for use later
  .then(_allDepartments => { // Get employees and their departments
    allDepartments = _allDepartments;
    return db.models.employees.findAll({ include: {
      model: db.models.departments,
      through: { attributes: [] } // Don't include the through table
    } });
  })
  .then(_employees => {
    employees = _employees;
    employees = employees.map(employee => {
      let attrs = {}; // Placeholder to add custom attributes to the employee
      if (employee.hasAllDepartments(allDepartments)) {
        attrs.allDepartments = true; // This lets us change the color of the view to yellow for this employee
      } else {
        if (employee.hasNoDepartments()) attrs.noDepartments = true; // This lets us change the color of the view to gray for this employee
        allDepartments.forEach(department => {
          if (!employee._hasDepartment(department)) {
            // Compile the department with an attribute of notAssigned
            employee.departments.push(Object.assign({}, department.get(), { notAssigned: true }));
          }
        });
      }
      employee.departments.sort((dep1, dep2) =>  dep1.id * 1 > dep2.id * 1);
      return Object.assign({}, employee.get(), attrs); // Compile the employee (this is necessary because adding attributes causes the .get() fuction to fail)
    });
  })
  .then(() => {
    let err;
    if (Object.keys(req.query).length) {
      err = req.query;
      err.err = err.err.split(',');
    }
    res.render('index', { allDepartments, employees, err });
  });
});


app.use('/departments', require('./routes/departments')(db));

app.use('/users', require('./routes/users')(db));

module.exports = app;
