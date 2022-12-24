const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0800",
  database: "user_management",
});

con.connect((err) => {
  if (err) console.log(err);
  else console.log("MySQL connection established");
});

module.exports=con