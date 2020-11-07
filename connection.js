const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
  host : "smbpmo.cxuucdxyi05s.us-east-2.rds.amazonaws.com",
  user : "admin",
  password : "jaTBB123!",
  database : "costapp",
  multipleStatements : true
});

mysqlConnection.connect((err)=>{
  if(!err)
    {
      console.log("Connected");
    }
  else
    {
      console.log("Connection Failed");
    }
});

module.exports = mysqlConnection;
