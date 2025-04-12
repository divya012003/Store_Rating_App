var mysql = require('mysql2');
var util = require('util')

const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'rating_app',
    password:'',
    port:'3307'
})

connection.connect((err)=>{
    if(err){
        console.log(err);
        
    }
    else{
        console.log("Database connected succesfully");
        
    }
})

var exe=util.promisify(connection.query).bind(connection);

module.exports=exe;