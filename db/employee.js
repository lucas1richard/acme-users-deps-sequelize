module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employees', {
    name: {
      type: DataTypes.STRING,
      validate: {
        isAlpha: { args: true, msg: 'Characters other than letters are not allowed'},
        len: { args: [3, 100], msg: 'Employee name length must be greater than 2 and less than 100' }
      },
      allowNull: false
    }
  }, {
    instanceMethods: {
      hasAllDepartments(departments) {
        if (!this.departments) throw new Error('Include departments in the query');
        return this.departments.length === departments.length;
      },
      hasNoDepartments() {
        if (!this.departments) throw new Error('Include departments in the query');
        return this.departments.length === 0;
      },
      _hasDepartment(department) {
        if (!this.departments) throw new Error('Include departments in the query');
        return this.departments.map(dep => dep.name).indexOf(department.name) > -1;
      }
    },
    classMethods: {
      handleDepartment(userId, departmentId, method) {
        let employee;
        return this.findOne({ where: { id: userId }}).then(_employee => {
          employee = _employee;
          return sequelize.models.departments.findOne({ where: {id: departmentId} });
        })
        .then(department => employee[method](department));
      }
    }
  });
};

