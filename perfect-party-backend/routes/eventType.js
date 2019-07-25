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
    let stmt = "SELECT typeid, typename, baseprice FROM eventType WHERE active = TRUE";
    console.log("eventType/list: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send({results, status:'SUCCESS'});
        }
    });
});

function whereClause(req, res, next) {
    const {typename, baseprice} = req.body;
    let str = "WHERE active = TRUE ";
    if (typename !== null) {
        str += `AND typename LIKE ${mysql.escape('%' + typename + '%')} `;
    }
    if (baseprice !== null) {
        str += `AND baseprice <= ${mysql.escape(baseprice)}`;
    }
    return str;
}

router.post('/listBySearch', (req, res, next) => {
    let where = whereClause(req, res, next);
    const stmt = "SELECT typeid, typename, baseprice FROM eventType " + where;
    console.log("eventType/listBySearch: ", stmt);
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
    const {typename, baseprice} = req.body;
    const stmt = `INSERT INTO eventType(typename, baseprice) `
        + `VALUES(${mysql.escape(typename)}, ${mysql.escape(baseprice)})`;
    console.log("eventType/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-TYPENAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: event type added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const {typename, typeid, baseprice} = req.body;
    const stmt = `UPDATE eventType SET `
        + `typename = ${mysql.escape(typename)}, baseprice = ${mysql.escape(baseprice)} `
        + `WHERE typeid = ${mysql.escape(typeid)}`;
    console.log("eventType/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-TYPENAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: event type updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const {typeid} = req.body;
    const stmt = `UPDATE eventType SET active = FALSE WHERE typeid = ${mysql.escape(typeid)}`;
    console.log("eventType/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: event type deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;
