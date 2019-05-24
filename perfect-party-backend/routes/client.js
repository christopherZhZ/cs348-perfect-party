const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'perfect_party_db',
    socketPath:'/tmp/mysql.sock'
});
connection.connect((err) => {
    if (err) throw err;
});

// ---------------------------------

router.get('/client/list', (req, res, next) => {
	let statement = "SELECT id, fname, lname, email FROM client ";
});

router.get('/client/listByFname', (req, res, next) => {
	const { fname } = req.body;
	let statement = "SELECT id, fname, lname, email FROM client ";
	statement += `WHERE fname LIKE '%${fname}%'`;
  connection.query(statement, (err, results, fields) => {
    if (err) throw err;
    res.send(results);
  });
});

// TODO: add more

module.exports = router;
