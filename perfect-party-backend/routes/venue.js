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
    let stmt = "SELECT venueid, name, address, price FROM venue WHERE active = TRUE";
    console.log("venue/list: ", stmt);
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
    const {name, address, price} = req.body;
    let str = "WHERE active = TRUE ";
    if (name !== null) {
        str += `AND name LIKE ${mysql.escape('%' + name + '%')} `;
    }
    if (address !== null) {
        str += `AND address LIKE ${mysql.escape('%' + address + '%')} `;
    }
    if (price !== null) {
        str += `AND price <= ${mysql.escape(price)}`;
    }
    return str;
}

router.post('/listBySearch', (req, res, next) => {
    let where = whereClause(req, res, next);
    const stmt = "SELECT venueid, name, address, price FROM venue " + where;
    console.log("venue/listBySearch: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send(results);
        }
    });
});

router.post('/add', (req, res, next) => {
    const {name, address, price} = req.body;
    const stmt = `INSERT INTO venue(name, address, price) `
        + `VALUES(${mysql.escape(name)}, ${mysql.escape(address)}, ${mysql.escape(price)})`;
    console.log("venue/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-ADDRESS'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: venue added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const {name, address, venueid, price} = req.body;
    const stmt = `UPDATE venue SET `
        + `name = ${mysql.escape(name)}, address = ${mysql.escape(address)}, price = ${mysql.escape(price)} `
        + `WHERE venueid = ${mysql.escape(venueid)}`;
    console.log("venue/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-ADDRESS'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: venue updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const {venueid} = req.body;
    const stmt = `UPDATE venue SET active = FALSE WHERE venueid = ${mysql.escape(venueid)}`;
    console.log("venue/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: venue deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;