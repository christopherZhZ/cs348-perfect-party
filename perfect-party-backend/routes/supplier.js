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
    let stmt = "SELECT supplierid, name, offeredtype, tel FROM supplier GROUP BY supplierid ORDER BY supplierid";
    console.log("supplier/list: ", stmt);
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
    const {name, offeredtype} = req.body;
    let str = "WHERE";
    if (name !== null) {
        str += ` name LIKE ${mysql.escape('%' + name + '%')} `;
    }
    if (offeredtype !== null) {
        if (name !== null) {
            str += " AND ";
        }
        str += ` offeredtype = ${mysql.escape(offeredtype)}`;
    }
    if (str === "WHERE") return "";
    return str;
}

router.post('/listBySearch', (req, res, next) => {
    let where = whereClause(req, res, next);
    const stmt = "SELECT supplierid, name, offeredtype, tel FROM supplier " + where;
    console.log("supplier/listBySearch: ", stmt);
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
    const {name, offeredtype, tel} = req.body;
    const stmt = `INSERT INTO supplier(name, offeredtype, tel) `
        + `VALUES(${mysql.escape(name)}, ${mysql.escape(offeredtype)}, ${mysql.escape(tel)})`;
    console.log("supplier/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-SUPPLIERNAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: supplier added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const {supplierid, name, offeredtype, tel} = req.body;
    const stmt = `UPDATE supplier SET `
        + `name = ${mysql.escape(name)}, offeredtype = ${mysql.escape(offeredtype)}, tel = ${mysql.escape(tel)} `
        + `WHERE supplierid = ${mysql.escape(supplierid)}`;
    console.log("supplier/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-SUPPLIERNAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: supplier updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const {supplierid} = req.body;
    const stmt = `DELETE FROM supplier WHERE supplierid = ${mysql.escape(supplierid)}`;
    console.log("supplier/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: supplier deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;
