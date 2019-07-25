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
    console.log("Connect successed.");
});

// ---------------------------------

router.post('/list', (req, res, next) => {
    let stmt = "SELECT paymentid, eventname, CONCAT(c.fname,' ',c.lname) as clientname, total " +
        "FROM payment p, event e, client c " +
        "WHERE p.eventid = e.eventid AND e.clientid = c.clientid AND historical = TRUE";
    console.log("payment/list: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send({results, status: 'SUCCESS'});
        }
    });
});

router.post('/add', (req, res, next) => {
    const {eventid, total} = req.body;
    const stmt = `INSERT INTO payment(eventid, total) `
        + `VALUES(${mysql.escape(eventid)}, ${mysql.escape(total)})`;
    console.log("payment/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: payment added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const {eventid, total} = req.body;
    const stmt = `UPDATE payment SET `
        + `total = ${mysql.escape(total)} `
        + `WHERE eventid = ${mysql.escape(eventid)}`;
    console.log("payment/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: payment updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const {eventid} = req.body;
    const stmt = `DELETE FROM payment WHERE eventid = ${mysql.escape(eventid)}`;
    console.log("payment/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: payment deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;
