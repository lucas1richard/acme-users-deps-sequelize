module.exports = (DataTypes, db) => db.define('users', {
  name: DataTypes.STRING
},
{
  instanceMethods: {
    hasAllDepartments() {

    },
    hasNoDepartments() {

    },
    hasDepartment() {

    },
    getUserDepartment() {

    }
  }
});
