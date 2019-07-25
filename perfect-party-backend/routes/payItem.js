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
    const stmt = "SELECT itemid, itemname, itemtype, itemprice, supplierid, picurl FROM payItem WHERE active = TRUE";
    console.log("payItem/list: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send({results, status: 'SUCCESS'});
        }
    });
});

router.post('/listByType', (req, res, next) => {
    const {itemtype} = req.body;
    const stmt = "SELECT itemid, itemname, itemtype, itemprice, name as suppliername, picurl " +
        "FROM payItem p, supplier s WHERE p.supplierid = s.supplierid AND active = TRUE " +
        `AND itemtype = ${mysql.escape(itemtype)} GROUP BY itemid ORDER BY itemid`;
    console.log("payItem/listByType ", stmt);
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
    const {itemname, itemtype, supplierid} = req.body;
    let str = "WHERE active = TRUE ";
    if (itemname !== null) {
        str += `AND itemname LIKE ${mysql.escape('%' + itemname + '%')} `;
    }
    if (itemtype !== null) {
        str += `AND itemtype = ${mysql.escape(itemtype)} `;
    }
    if (supplierid !== null) {
        str += `AND supplierid = ${mysql.escape(supplierid)}`;
    }
    return str;
}

router.post('/listBySearch', (req, res, next) => {
    const where = whereClause(req, res, next);
    const stmt = "SELECT itemid, itemname, itemtype, itemprice, supplierid, picurl FROM payItem " + where;
    console.log("payItem/listBySearch: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send({results, status:'SUCCESS'});
        }
    });
});

router.post('/add', (req, res, next) => {
    const {itemname, itemtype, itemprice, supplierid, picurl} = req.body;
    const stmt = `INSERT INTO payItem(itemname, itemtype, itemprice, supplierid, picurl) `
        + `VALUES(${mysql.escape(itemname)}, ${mysql.escape(itemtype)}, 
        ${mysql.escape(itemprice)}, ${mysql.escape(supplierid)}, ${mysql.escape(picurl)})`;
    console.log("payItem/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-ITEMNAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: item added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/updater', (req, res, next) => {
    const {itemid, itemname, itemprice, supplierid, picurl} = req.body;
    /*
        const stmt = `UPDATE payItem SET `
            + `itemname = ${mysql.escape(itemname)}, itemType = ${mysql.escape(itemtype)},
            itemprice = ${mysql.escape(itemprice)}, supplierid = ${mysql.escape(supplierid)} `
            + `WHERE itemid = ${mysql.escape(itemid)}`;
    */
    const stmt = `UPDATE payItem SET `
        + `itemname = ${mysql.escape(itemname)}, itemprice = ${mysql.escape(itemprice)}, `
        + `supplierid = ${mysql.escape(supplierid)}, picurl = ${mysql.escape(picurl)} `
        + `WHERE itemid = ${mysql.escape(itemid)}`;
    console.log("payItem/updater: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-ITEMNAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: item updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const {itemname, itemtype, itemid, itemprice, supplierid} = req.body;
/*
    const stmt = `UPDATE payItem SET `
        + `itemname = ${mysql.escape(itemname)}, itemType = ${mysql.escape(itemtype)}, 
        itemprice = ${mysql.escape(itemprice)}, supplierid = ${mysql.escape(supplierid)} `
        + `WHERE itemid = ${mysql.escape(itemid)}`;
*/
    const stmt = `UPDATE payItem SET `
        + `itemname = ${mysql.escape(itemname)}, itemprice = ${mysql.escape(itemprice)} `
        + `WHERE itemid = ${mysql.escape(itemid)}`;
    console.log("payItem/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-ITEMNAME'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: item updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const {itemid} = req.body;
    const stmt = `UPDATE payItem SET active = FALSE WHERE itemid = ${mysql.escape(itemid)}`;
    console.log("payItem/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: item deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;