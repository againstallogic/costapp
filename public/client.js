console.log('Client-side code running');

var people = ["Ben", "Brent", "James", "Taylor", "Trevor"];

//add people to html form
form = document.getElementById("form");
for (let i = 0; i < people.length; i++) {
  var person = people[i];
  element=document.createElement("INPUT");
  element.type='checkbox';
  element.id = person;
  element.name=person;
  form.appendChild(element);
  label=document.createElement("LABEL");
  label.for = person;
  label.innerHTML = " " + person + "<br>";
  form.appendChild(label);
}



function daysLeft() {
  today=Date.now();
  var trip=new Date("Febrary 28, 2021");
  if (trip>today) {
    let time = dhm(trip-today);
    document.getElementById('days_left').textContent = time;
  }
}
function dhm(ms){
    days = Math.floor(ms / (24*60*60*1000));
    daysms=ms % (24*60*60*1000);
    hours = Math.floor((daysms)/(60*60*1000));
    hoursms=ms % (60*60*1000);
    minutes = Math.floor((hoursms)/(60*1000));
    minutesms=ms % (60*1000);
    sec = Math.floor((minutesms)/(1000));
    return days+" days, "+hours+" hours, "+minutes+" minutes, "+sec+" seconds";
}

//add expenses from form to database
const submit = document.getElementById('submit');
submit.addEventListener('click', function(e) {
  add_expense();
});

function add_expense() {
  console.log('button was clicked');
  let json = getFormValues();
  fetch('/add_expense', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: json})
    .then(function(response) {
      if(response.ok) {
        console.log('expense was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getFormValues() {
  var obj = new Object();
   obj.description = document.getElementById("description").value;
   obj.amount  = document.getElementById("amount").value;
   obj.who_paid = document.getElementById("who_paid").value;
   obj.Ben = document.getElementById("Ben").checked;
   obj.Brent = document.getElementById("Brent").checked;
   obj.James = document.getElementById("James").checked;
   obj.Taylor = document.getElementById("Taylor").checked;
   obj.Trevor = document.getElementById("Trevor").checked;
   var json= JSON.stringify(obj);
  //clear form
  document.getElementById("form").reset();
  return json;
}

//get expenses & totals every second & show
setInterval(function() {
  daysLeft();
  get_totals();
  fetch('/get_expenses', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      document.getElementById('counter').innerHTML = `${data.length} records retrieved`;
      //remove previous rows
      var tbodyRef = document.getElementById('expenses');
      while(tbodyRef.hasChildNodes())
        {
          tbodyRef.removeChild(tbodyRef.firstChild);
        }
      //add header
      addHeader();
      //add new rows
      addRow(data);
    })
    .catch(function(error) {
      console.log(error);
    });
}, 1000);

function addHeader(data) {
  var tbodyRef = document.getElementById('expenses');
  var header = tbodyRef.createTHead();
  var row = header.insertRow();
  var cell1 = row.insertCell();
  cell1.innerHTML = "<b>ID</b>";
  var cell2 = row.insertCell();
  cell2.innerHTML = "<b>Description</b>";
  var cell3 = row.insertCell();
  cell3.innerHTML = "<b>Amount</b>";
  var cell4 = row.insertCell();
  cell4.innerHTML = "<b>Who Paid</b>";
  var cell5 = row.insertCell();
  cell5.innerHTML = "<b># Recipients</b>";
  var cell6 = row.insertCell();
  cell6.innerHTML = "<b>Ben</b>";
  var cell7 = row.insertCell();
  cell7.innerHTML = "<b>Brent</b>";
  var cell8 = row.insertCell();
  cell8.innerHTML = "<b>James</b>";
  var cell9 = row.insertCell();
  cell9.innerHTML = "<b>Taylor</b>";
  var cell10 = row.insertCell();
  cell10.innerHTML = "<b>Trevor</b>";
}

function addRow(data) {
  var tbodyRef = document.getElementById('expenses');
  var people = ["Ben", "Brent", "James", "Taylor", "Trevor"];
//for each expense
  for (var expense in data) {
    // Insert a row at the end of table
    var newRow = tbodyRef.insertRow();
    expense = data[expense];
    //for each key in expense, check if variable is a person, if not, add expense normally
    for (var key in expense) {
      //skip created field
      if (key == "created") {
        continue;
      }
      var newCell = newRow.insertCell();
      var nomatch=true
      for (let i = 0; i < people.length; i++) {
        var listperson = people[i];
        if (listperson == key && expense[key]==1) {
          newCell.innerHTML = "X";
          nomatch = false;
        } else if (listperson == key && expense[key]==0) {
          newCell.innerHTML = "";
          nomatch = false;
        }
      }
      if (nomatch==true) {
        newCell.innerHTML = expense[key];
      }

    }
  }
}



async function get_totals() {
  let balance = await get_balance();
  var tbodyRef = document.getElementById('balances');
  //clear table
  while(tbodyRef.hasChildNodes())
    {
      tbodyRef.removeChild(tbodyRef.firstChild);
    }
  //rebuild table
  var header = tbodyRef.createTHead();
  var headerRow = header.insertRow();
  var balanceRow = tbodyRef.insertRow();
  for (person in balance) {
   var headerCell = headerRow.insertCell();
   headerCell.innerHTML = `<b>${person}</b>`
   var balanceCell = balanceRow.insertCell();
   balanceCell.innerHTML = `${balance[person]}`
  }
}


function get_balance() {
  return new Promise((resolve, reject) => {
    fetch('/get_expenses', {method: 'GET'})
      .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
      })
      .then(function(data) {
        var people = ["Ben", "Brent", "James", "Taylor", "Trevor"];
        //create totals object
        var balance = new Object();
        for (var person in people) {
          person = people[person];
          balance[person] = 0;
        }
        //iterate and add individuals debits to object
        for (var person in people) {
          person = people[person];
          for(var i = 0; i < data.length; i++) {
            var expense = data[i];
            if (person == expense.who_paid) {
              balance[person] += Number(expense.amount);
            }
          }
        }
        //iterate and subtract individuals credits to object
        for (var person in people) {
          person = people[person];
          for(var i = 0; i < data.length; i++) {
            var expense = data[i];
            if (expense[person]==1) {
              balance[person] -= Number(expense.amount) / Number(expense.count_recipients);
            }
          }
        }
        //round
        for (var person in balance) {
          balance[person]=Math.round(Number(balance[person]) *100)/100;
        }
        //return balance
        resolve(balance);
      })
      .catch(function(error) {
        console.log(error);
      });
  })
}
