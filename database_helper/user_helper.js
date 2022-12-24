const con = require("../config/databaseConfig");
const bcrypt = require("bcrypt");

module.exports = {
  doSignup: async (userData, callback) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const signup = `INSERT INTO users (user_name,user_password,user_email ) VALUES ('${userData.username}','${userData.password}','${userData.email}' )`;
    con.query(signup, (err, result) => {
      if (err) callback(err.code);
      else callback("Success");
    });
  },
  doLogin: (userData, callback) => {
    const login = `SELECT * FROM users WHERE user_email = '${userData.email}'`;
    con.query(login, async (err, result) => {
      if (err) callback("Error");
      else if (result.length === 0) callback(false);
      else {
        const matchPassword = await bcrypt.compare(
          userData.password,
          result[0].user_password
        );
        if (matchPassword) {
          await con.query(`UPDATE users SET maxIncorrectAttempts = '0' WHERE user_email = '${result[0].user_email}'`,(err,result)=>{
            if(err) throw err;
          })
          callback(result[0]);
        }
        else  {

        if(result[0].blocked){

          callback('blocked')

        }

        else{
          
          if(result[0].maxIncorrectAttempts <3) {
            
          await con.query(`UPDATE users SET maxIncorrectAttempts = ${result[0].maxIncorrectAttempts+1} WHERE user_email = '${result[0].user_email}'`,(err,result) => {
              if(err) throw err;
            })

            callback(false)

          }
          else if(result[0].maxIncorrectAttempts == 3) {
            const date = new Date()
            date.setSeconds(date.getSeconds() + 15);

            const unblockDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`



            await con.query(`UPDATE users SET blocked = true WHERE user_email = '${result[0].user_email}'`,(err,result)=>{
              if(err) throw err;
            })

            const sql = `CREATE EVENT unblock
            ON SCHEDULE AT '${unblockDate}'
            DO
            UPDATE users SET blocked = false WHERE user_email = '${result[0].user_email}'`

            await con.query(sql,(err,result)=>{
              if(err) throw err;
            })

            await con.query(`UPDATE users SET maxIncorrectAttempts = '0' WHERE user_email = '${result[0].user_email}'`,(err,result)=>{
              if(err) throw err;
            })
            
          }

         
        }

        }
      }
    });
  },

  verifyEmail: (email) => {
    const sql = `UPDATE users SET user_status = 'verified' WHERE user_email = '${email}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  },
};
