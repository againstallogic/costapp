//install mysql server
//npm install --save express express-handlebars mysql body-parser
//npm install --save-dev nodemon
//sudo npm install -g --force nodemon

//asdfasdfasdf

const mysql = require("mysql");
const express = require("express");
var bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const path = require('path');

var app = express();

//v1
app.use(bodyParser.json());

//Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.get("/", (req, res) => {
  //eji
  //res.render("index")
  res.sendFile(__dirname + '/index.html');
});



app.post('/clicked', (req, res) => {
  const query = 'INSERT INTO clicks(id,clicktime) VALUES (NULL,NOW());';
  mysqlConnection.query(query, (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
        console.log('data populated');
      }
    else
      {
        console.log(err);
      }
  })
})

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
  const query = 'INSERT INTO expenses(id,description, amount, who_paid, count_recipients, created, Ben, Brent, James, Taylor, Trevor) VALUES (NULL,"'+description+'",'+amount+',"'+who_paid+'",'+count_recipients+',NOW(),'+ben+','+brent+','+james+','+taylor+','+trevor+');';
  mysqlConnection.query(query, (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
        console.log('data populated');
      }
    else
      {
        console.log(err);
      }
  })
})

app.get('/get_expenses', (req, res) => {
  mysqlConnection.query("SELECT * from expenses", (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
      }
    else
      {
        console.log(err);
      }
  })
})

app.get('/get_individuals_debits', (req, res) => {
  mysqlConnection.query("select sum(amount) debits from expenses where who_paid = 'Ben';", (err, rows, fields)=>{
    if(!err)
      {
        res.send(rows);
      }
    else
      {
        console.log(err);
      }
  })
})


app.listen(3000);
