const mysql = require('mysql2');
require('dotenv/config');


var pool = mysql.createPool({
  "user": "victor",
  "password": "impressora",
  "database": "ecommerce",
  "host": "localhost",
  "port": 3306
});

exports.pool = pool;