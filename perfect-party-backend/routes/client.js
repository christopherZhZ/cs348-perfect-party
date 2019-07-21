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
    let statement = "SELECT id, fname, lname, email FROM client";
    connection.query(statement, (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    });
});

router.get('/client/listByFname', (req, res, next) => {
	const { fname } = req.body;
	const statement = "SELECT id, fname, lname, email FROM client " +
        `WHERE fname LIKE '%${fname}%'`;
	connection.query(statement, (err, results, fields) => {
	    if (err) throw err;
        res.send(results);
    });
});

router.post('./client/add', (req, res, next) => {
    const { fname, lname, email } = req.body;
    const stmt = `INSERT INTO client(fname, lname, email) `
        +`VALUES(${mysql.escape(fname)}, ${mysql.escape(lname)}, ${mysql.escape(email)})`;
    connection.query(stmt, (err, results, fields) => {
        if (err) throw err;
        console.log("DB: client added!")
    })
    res.send({ status: 'SUCCESS' });
});

// TODO: add more

module.exports = router;
