const bcrypt = require('bcrypt');
const con = require("../config/databaseConfig");
 
module.exports = {
  getUsers: (callback) => {
    sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      else callback(result);
    });
  },
  editUser: async (editData) => {
    let sql;
    if(editData.password){
      const password = await bcrypt.hash(editData.password,10)
       sql = `UPDATE users SET user_name = '${editData.username}',user_password = '${password}' WHERE user_email = '${editData.email}'`;    
    }
    else {
       sql = `UPDATE users SET user_name = '${editData.username}' WHERE user_email = '${editData.email}'`; 
    }

   con.query(sql, (err, result) => {
      if (err) throw err
      else console.log('Success'); 
   })

  },
  deleteUser:async ({email})=>{
    sql = `DELETE FROM users WHERE user_email = '${email}'  `;

  await con.query(sql, (err, result) => {
      if (err) throw err
    })
  }
};
