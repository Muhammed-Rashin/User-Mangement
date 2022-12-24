const databaseHelper = require("../database_helper/admin_helper");
module.exports = {
  getAdminPage: (req, res) => {
    databaseHelper.getUsers((users) => {
      res.render("admin/admin", { users: users });
    });
  },
  editUser: async (req, res) => {
   const result = await databaseHelper.editUser(req.body);
  },

  deleteUser: async (req, res) => {
   await databaseHelper.deleteUser(req.body)
  },
};
