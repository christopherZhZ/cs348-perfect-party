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

router.post('/listByID', (req, res, next) => {
    const {eventid} = req.body;
    let stmt = `SELECT recordid, itemid, amount FROM itemSelectRecord WHERE eventid = ${mysql.escape(eventid)}`;
    console.log("itemSelectRecord/listByID: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            res.send({results, status: 'SUCCESS'});
        }
    });
});

router.post('/addByList', (req, res, next) => {
    const { eventid, itemList } = req.body;
    const len = itemList.length;
    let success = 1;
    for (i = 0; i < len; i++) {
        const itemid = itemList[i]["itemid"];
        const amount = itemList[i]["amount"];
        const stmt = `INSERT INTO itemSelectRecord(eventid, itemid, amount) `
            + `VALUES(${mysql.escape(eventid)}, ${mysql.escape(itemid)}, ${mysql.escape(amount)})`;
        console.log("itemSelectRecord/addByList: ", stmt);
        connection.query(stmt, (err, results, fields) => {
            if (err) {
                success = 0;
                if (err.code === "ER_DUP_ENTRY") {
                    res.send({status: 'DUP-ITEMSELECT'});
                } else {
                    console.log("[!]", err);
                    res.send({status: 'FAIL'});
                }
            }
        });
        if (!success) {
            break;
        }
    }
    if (success) {
        console.log("DB: item selection records from the list added!");
        res.send({status: 'SUCCESS'});
    } else {
        res.send({status: 'FAIL'});
    }

});

router.post('/add', (req, res, next) => {
    const {eventid, itemid, amount} = req.body;
    const stmt = `INSERT INTO itemSelectRecord(eventid, itemid, amount) `
        + `VALUES(${mysql.escape(eventid)}, ${mysql.escape(itemid)}, ${mysql.escape(amount)})`;
    console.log("itemSelectRecord/add: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.send({status: 'DUP-ITEMSELECT'});
            } else {
                console.log("[!]", err);
                res.send({status: 'FAIL'});
            }
        } else {
            console.log("DB: item selection record added!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const {eventid, itemid, amount} = req.body;
    const stmt = `UPDATE itemSelectRecord SET `
        + `amount = ${mysql.escape(amount)} `
        + `WHERE eventid = ${mysql.escape(eventid)} AND itemid = ${mysql.escape(itemid)}`;
    console.log("itemSelectRecord/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: item selection record updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const {recordid} = req.body;
    const stmt = `DELETE FROM itemSelectRecord WHERE recordid = ${recordid}`;
    console.log("itemSelectRecord/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: item selection record deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/deleteByEvent', (req, res, next) => {
    const {eventid} = req.body;
    const stmt = `DELETE FROM itemSelectRecord WHERE eventid = ${eventid}`;
    console.log("itemSelectRecord/deleteByEvent: ", stmt);// .
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log(`DB: item selection record for event ${eventid} deleted!`);
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;
