var mysql = require ("mysql");
var inquirer = require("inquirer");



var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon",

});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();

});

function start() {
   
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.log("Welcome to Bamazon! Bellow are our items!\n")
        for (i=0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " Product: " + res[i].product_name + " Quantity: " + res[i].stock_quantity) 
        };
    
    
    console.log("---------------------------------------------------------------- ");
    inquirer.prompt([
        {
        name: "id", 
        type: "input",
        message: "What is the id of the item you want to buy?\n",
        validate: function(value){
            if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
              return true;
            } else{
              return false;
            }
        }
        },
        {
        name: "units",
        type: "input",
        message: "How many unit would you like?\n",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        
        },
    
    ])
    .then(function(answer) {
        var item = (answer.id)-1;
        var qty = answer.units;
        if (res[item].stock_quantity < 1 || qty > res[item].stock_quantity){
            console.log("I am sorry we do not have enough " + res[item].product_name + ". Please pick an appropiate amount.")
            start()
        }else{
        connection.query(
            "UPDATE products SET ? WHERE ?",[
            {
                stock_quantity: res[item].stock_quantity-qty,
            },
            { 
                id: answer.id
            }],
            function(err) {
                if (err) throw err;
                 console.log("You have bought " + qty + " units of " + res[item].product_name);
                 retry();
            }
        );
    }
    });
    
});

};

function retry() {
    inquirer.prompt([
        {
        name: "choice",
        type: "confirm",
        message: "Would you like to go shopping some more?"
     }
    ])
    .then(function(answer) {
        if (answer.choice){
            start()
        } else {
            console.log("Thank you for shopping at bamazon!")
            connection.end();
        };
    });
};
