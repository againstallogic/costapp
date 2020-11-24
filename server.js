//centralize people
//soft delete
//transaction date in form
//form validation
//add/delete recipients
//html tabs


const mysql = require("mysql");
const express = require("express");
const db_config = require("./connection");
var bodyParser = require("body-parser");

const path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.post('/add_expense', (req, res) => {
  description = req.body.description;
  amount = req.body.amount;
  who_paid = req.body.who_paid;
  ben = req.body.Ben;
  brent = req.body.Brent;
  james = req.body.James;
  taylor = req.body.Taylor;
  trevor = req.body.Trevor;
  //count_recipients
  var count_recipients = 0;
  if(req.body.Ben==true){
    count_recipients+=1;
  }
  if(req.body.Brent==true){
    count_recipients+=1;
  }
  if(req.body.James==true){
    count_recipients+=1;
  }
  if(req.body.Taylor==true){
    count_recipients+=1;
  }
  if(req.body.Trevor==true){
    count_recipients+=1;
  }
  query = 'INSERT INTO expenses(id,description, amount, who_paid, count_recipients, created, Ben, Brent, James, Taylor, Trevor) VALUES (NULL,"'+description+'",'+amount+',"'+who_paid+'",'+count_recipients+',NOW(),'+ben+','+brent+','+james+','+taylor+','+trevor+');';
  mysqlConnection = mysql.createConnection(db_config);
  mysqlConnection.query(query, (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
        console.log('data populated');
        mysqlConnection.end();
      }
    else
      {
        console.log(err);
      }
  })
})

app.get('/get_expenses', (req, res) => {
  mysqlConnection = mysql.createConnection(db_config);
  mysqlConnection.query("SELECT * from expenses", (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
        console.log('data retrieved');
        mysqlConnection.end();
      }
    else
      {
        console.log(err);
      }
  })
})

app.post('/remove_row', (req, res) => {
  query = "DELETE FROM expenses where id="+req.body.id+";"
  mysqlConnection = mysql.createConnection(db_config);
  mysqlConnection.query(query, (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
        console.log('data deleted');
        mysqlConnection.end();
      }
    else
      {
        console.log(err);
      }
  })
})


app.listen(3100);
