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
    let stmt = "SELECT clientid, fname, lname, email FROM client WHERE active = TRUE";
    console.log("client/list: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send({results, status: 'SUCCESS'});
        }
    });
});

function whereClause(req, res, next) {
    const {fname, lname, email} = req.body;
    let str = "WHERE active = TRUE ";
    if (fname !== null) {
        str += `AND fname LIKE ${mysql.escape('%' + fname + '%')} `;
    }
    if (lname !== null) {
        str += `AND lname LIKE ${mysql.escape('%' + lname + '%')} `;
    }
    if (email !== null) {
        str += `AND email LIKE ${mysql.escape('%' + email + '%')}`;
    }
    return str;
}

router.post('/listBySearch', (req, res, next) => {
    let where = whereClause(req, res, next);
    const stmt = "SELECT clientid, fname, lname, email FROM client " + where;
    console.log("client/listBySearch: ", stmt);
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
    const {fname, lname, email} = req.body;
    const stmt = `INSERT INTO client(fname, lname, email) `
        + `VALUES(${mysql.escape(fname)}, ${mysql.escape(lname)}, ${mysql.escape(email)})`;
    console.log("client/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-EMAIL'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: client added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const { fname, lname, clientid, email } = req.body;
    const stmt = `UPDATE client SET `
        + `fname = ${mysql.escape(fname)}, lname = ${mysql.escape(lname)}, email = ${mysql.escape(email)} `
        + `WHERE clientid = ${mysql.escape(clientid)}`;
    console.log("client/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-EMAIL'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: client updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const { clientid } = req.body;
    const stmt = `UPDATE client SET active = FALSE WHERE clientid = ${mysql.escape(clientid)}`;
    console.log("client/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: client deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;
