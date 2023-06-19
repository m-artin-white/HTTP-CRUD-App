const mysql = require('mysql2');

//I used XAMPP to connect to my database, which is just a MYSQL database. When you connect, my program creates a new database called users and creates the
//required columns and so on.

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});

connection.connect((err)=>{
    if(err)throw err;
    console.log("Connected to database!");
});

module.exports=connection;

