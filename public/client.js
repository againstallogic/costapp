console.log('Client-side code running');

var people = ["Ben", "Brent", "James", "Taylor", "Trevor"];

//add people to html form
form = document.getElementById("form");
for (let i = 0; i < people.length; i++) {
  var person = people[i];
  whoPaidSelect = document.getElementById('who_paid');
  whoPaidSelect.options[whoPaidSelect.options.length] = new Option(person, person);
  //create recipients checkboxes
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
daysLeft();
get_show_expenses();
get_show_balances();


//update every 1 seconds
setInterval(function() {
  daysLeft();
}, 1000);

//add expenses from form to database
const submit = document.getElementById('submit');
submit.addEventListener('click', function(e) {
  add_expense();
});

function add_expense() {
  let json = getFormValues();
  fetch('/add_expense', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: json})
    .then(function(response) {
      if(response.ok) {
        console.log('expense successfully recorded');
        get_show_expenses();
        get_show_balances();
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
   for (let i = 0; i < people.length; i++) {
     var person = people[i];
     obj[person] = document.getElementById(person).checked;
   }
   var json= JSON.stringify(obj);
  //clear form
  document.getElementById("form").reset();
  return json;
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

function get_show_expenses() {
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
}

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
  for (let i = 0; i < people.length; i++) {
    var person = people[i];
    var cell = row.insertCell();
    cell.innerHTML = "<b>"+person+"</b>";
  }
  var cellLast = row.insertCell();
  cellLast.innerHTML = "<b>Delete?</b>";
}

function addRow(data) {
  var tbodyRef = document.getElementById('expenses');
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
          newCell.style = "text-align:center";
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
    var newCell = newRow.insertCell();
    newCell.style = "text-align:center";
    var input = document.createElement("input");
    input.type = "image";
    input.name="imgbtn";
    input.src="trash.png"
    input.id="delete";
    input.setAttribute('onclick', 'removeRow(this)');

    //input.appendChild(img);
    newCell.appendChild(input);
  }
}

function removeRow(oButton) {
  //get ID of row where button was clicked
  var row = oButton.parentNode.parentNode.rowIndex;
  var id = document.getElementById("expenses").rows[row].cells[0].innerHTML;
  id = id.toString();
  var json = new Object();
  json["id"] = id;
  json = JSON.stringify(json);
  fetch('/remove_row', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: json})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      console.log("record successfully removed");
      get_show_expenses();
      get_show_balances();
    })
    .catch(function(error) {
      console.log(error);
    });

}




async function get_show_balances() {
  let balance = await get_balances();
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
  console.log(balance);
  get_show_ledger(balance);

}

function get_balances() {
  return new Promise((resolve, reject) => {
    fetch('/get_expenses', {method: 'GET'})
      .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
      })
      .then(function(data) {
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
async function get_show_ledger(balance) {
  let ledger = await calculate_ledger(balance);

  var tbodyRef = document.getElementById('ledger');
  //clear table
  while(tbodyRef.hasChildNodes())
    {
      tbodyRef.removeChild(tbodyRef.firstChild);
    }
  //rebuild table
  var header = tbodyRef.createTHead();
  for (record in ledger.records) {
    Payee = ledger.records[record].Payee;
    Recipient = ledger.records[record].Recipient;
    Amount = ledger.records[record].Amount;
    var ledgerRow = tbodyRef.insertRow();
    var recordCell = ledgerRow.insertCell();
    recordCell.innerHTML = Payee + " pays " + Recipient + " $" + Amount;
  }

}
function calculate_ledger(balance) {
  return new Promise((resolve, reject) => {
  lBalance = balance;

  ledger = new Object();
  ledger = {"records": []};
  var totalOutstanding = 0;
  for (var person in lBalance) {
    totalOutstanding += Math.abs(lBalance[person]);
  }
  //ledger
  while (totalOutstanding>1) {
    //find min and max values and people
    var max = 0;
    var min = 0;
    var maxPerson;
    var minPerson;
    for (var person in lBalance) {
      if (lBalance[person] < min) min = lBalance[person];
      if (lBalance[person] > max) max = lBalance[person];
    }
    for (var person in lBalance) {
      if (lBalance[person] == min) minPerson = person;
      if (lBalance[person] == max) maxPerson = person;
    }
    //get absolute values
    absMin = Math.abs(min);
    absMax = Math.abs(max);
    absolute = Math.min(absMin, absMax);
    //record in ledger
    record = new Object();
    record["Recipient"] = maxPerson;
    record["Payee"] = minPerson;
    record["Amount"] = absolute;
    ledger.records.push(record);
    //update balances
    absolute
    for (var person in lBalance) {
      if (person == maxPerson) lBalance[person] -= absolute;
      if (person == minPerson) lBalance[person] += absolute;
    }
    //update total outstanding amount
    totalOutstanding =0;
    for (var person in lBalance) {
      totalOutstanding += Math.abs(lBalance[person]);
    }

  }

  console.log(ledger);
  resolve(ledger);


})}
