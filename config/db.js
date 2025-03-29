const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: 'root',  
  database: 'contactdb', 
});

const promisePool = pool.promise();

pool.getConnection((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); 
  }
  console.log('MySQL connected successfully!');
});

module.exports = promisePool;
