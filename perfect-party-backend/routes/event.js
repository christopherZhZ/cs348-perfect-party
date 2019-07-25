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

function createEvent(result) {
    const results = [...result];
    console.log(JSON.stringify(results, null, 2));
    if (results.length === 0) {
        return results;
    } else {
        let returnVal = [];
        let itemList = [];
        let price = 0;
        const len = results.length;
        let eventid = -1;
        let event = {};
        for (i = 0; i < len; i++) {
            if (results[i]["eventid"] !== eventid) {
                if (eventid !== -1) {
                    event["totalprice"] = price.toFixed(2);
                    event["itemlist"] = itemList;
                    returnVal.push(event);
                    price = 0;
                    itemList = [];
                    event = {};
                }
                event["clientname"] = results[i]["clientname"];
                event["eventid"] = results[i]["eventid"];
                event["eventname"] = results[i]["eventname"];
                event["typename"] = results[i]["typename"];
                event["typeid"] = results[i]["typeid"];
                event["budget"] = results[i]["budget"];
                event["baseprice"] = results[i]["baseprice"];
                event["venueprice"] = results[i]["venueprice"];
                event["venuename"] = results[i]["venuename"];
                event["venueid"] = results[i]["venueid"];
                event["address"] = results[i]["address"];
                event["eventdate"] = results[i]["eventdate"];
                event["numinvitees"] = results[i]["numinvitees"];
                event["historical"] = results[i]["historical"];
                price += results[i]["baseprice"] + results[i]["venueprice"];
                eventid = results[i]["eventid"];
            }
            let item = {};
            if ('itemid' in results[i]) item["itemid"] = results[i]["itemid"];// .
            item["itemname"] = results[i]["itemname"];
            item["itemtype"] = results[i]["itemtype"];
            item["itemprice"] = results[i]["itemprice"];
            item["amount"] = results[i]["amount"];
            price += item["itemprice"] * item["amount"];
            itemList.push(item);
            if (i === len - 1) {
                event["totalprice"] = price.toFixed(2);
                event["itemlist"] = itemList;
                returnVal.push(event);
            }
        }
        console.log("origin", JSON.stringify(returnVal, null, 2));
        return returnVal;
    }

}

router.post('/list', (req, res, next) => {
    const stmt =
        "SELECT CONCAT(c.fname,' ',c.lname) as clientname, e.eventid, eventname, t.typename, t.typeid, " +
        "budget, baseprice, price as venueprice, v.name as venuename, v.venueid, v.address, eventdate, numinvitees, historical, itemname, itemtype, itemprice, amount " +
        "FROM client c, event e, eventType t, venue v, itemSelectRecord i, payItem p " +
        "WHERE c.clientid=e.clientid AND e.typeid=t.typeid AND v.venueid=e.venueid AND " +
        "i.eventid = e.eventid AND p.itemid = i.itemid GROUP BY e.eventid, itemname, amount ORDER BY e.eventid";
    console.log("event/list: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            const returnVal = [...createEvent(results)];
            console.log("returnVal", JSON.stringify(returnVal, null, 2));
            res.send({results: returnVal, status:'SUCCESS'});
        }
    });
});

router.post('/listHistorical', (req, res, next) => {
    const stmt =
        "SELECT CONCAT(c.fname,' ',c.lname) as clientname, e.eventid, eventname, t.typename, t.typeid, " +
        "budget, baseprice, price as venueprice, v.name as venuename, v.venueid, v.address, eventdate, numinvitees, historical, itemname, itemtype, itemprice, amount " +
        "FROM client c, event e, eventType t, venue v, itemSelectRecord i, payItem p " +
        "WHERE c.clientid=e.clientid AND e.typeid=t.typeid AND v.venueid=e.venueid AND historical = TRUE " +
        "AND i.eventid = e.eventid AND p.itemid = i.itemid GROUP BY e.eventid, itemname, amount ORDER BY e.eventid";
    console.log("event/listHistorical: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            const returnVal = [...createEvent(results)];
            console.log("returnVal", JSON.stringify(returnVal, null, 2));
            res.send({results: returnVal, status:'SUCCESS'});
        }
    });
});

router.post('/listFuture', (req, res, next) => {
    const stmt =
        "SELECT CONCAT(c.fname,' ',c.lname) as clientname, e.eventid, eventname, t.typename, t.typeid, " +
        "budget, baseprice, price as venueprice, v.name as venuename, v.venueid, v.address, eventdate, numinvitees, historical, itemname, itemtype, itemprice, amount " +
        "FROM client c, event e, eventType t, venue v, itemSelectRecord i, payItem p " +
        "WHERE c.clientid=e.clientid AND e.typeid=t.typeid AND v.venueid=e.venueid AND historical = FALSE " +
        "AND i.eventid = e.eventid AND p.itemid = i.itemid GROUP BY e.eventid, itemname, amount ORDER BY e.eventid";
    console.log("event/listFuture: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            const returnVal = [...createEvent(results)];
            console.log("returnVal", JSON.stringify(returnVal, null, 2));
            res.send({results: returnVal, status:'SUCCESS'});
        }
    });
});

router.post('/get', (req, res, next) => {
    const { eventid } = req.body;
    const stmt =
        "SELECT CONCAT(c.fname,' ',c.lname) as clientname, e.eventid, eventname, t.typename, t.typeid, budget, " +
        "baseprice, price as venueprice, v.name as venuename, v.venueid, v.address, eventdate, " +
        "numinvitees, historical, p.itemid, itemname, itemtype, itemprice, amount " +
        "FROM client c, event e, eventType t, venue v, itemSelectRecord i, payItem p " +
        "WHERE c.clientid=e.clientid AND e.typeid=t.typeid AND v.venueid=e.venueid AND " +
        "i.eventid = e.eventid AND p.itemid = i.itemid " +
        `AND e.eventid = ${mysql.escape(eventid)}`;
    console.log("event/list: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            const returnVal = [...createEvent(results)];
            res.send({results: returnVal[0], status:'SUCCESS'});
        }
    });
});

router.post('/listBySupplier', (req, res, next) => {
    const { supplierid } = req.body;
    const stmt =
        "SELECT CONCAT(c.fname,' ',c.lname) as clientname, e.eventid, eventname, t.typename, t.typeid, budget, " +
        "baseprice, price as venueprice, v.name as venuename, v.venueid, v.address, eventdate, " +
        "numinvitees, historical, itemname, itemtype, itemprice, amount " +
        "FROM client c, event e, eventType t, venue v, itemSelectRecord i, payItem p, supplier s " +
        "WHERE c.clientid=e.clientid AND e.typeid=t.typeid AND v.venueid=e.venueid AND " +
        "i.eventid = e.eventid AND p.itemid = i.itemid " +
        `AND s.supplierid = ${mysql.escape(supplierid)} AND s.supplierid = p.supplierid ` +
        `GROUP BY e.eventid, itemname, amount ORDER BY e.eventid`;
    console.log("event/listBySupplier: ", stmt)
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            const returnVal = [...createEvent(results)];
            res.send({results: returnVal, status:'SUCCESS'});
        }
    });
});


router.post('/add', (req, res, next) => {
    const { clientid, eventname, typeid, budget, eventdate, venueid, numinvitees } = req.body;
    const stmt = `INSERT INTO event(clientid, eventname, typeid, budget, eventdate, venueid, numinvitees) `
        +`VALUES(${mysql.escape(clientid)}, ${mysql.escape(eventname)}, ${mysql.escape(typeid)}, ${mysql.escape(budget)}, 
        ${mysql.escape(eventdate)}, ${mysql.escape(venueid)}, ${mysql.escape(numinvitees)})`;
    console.log("event/add:", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: event added! insertId =>",results.insertId);
            res.send({status: 'SUCCESS', insertId: results.insertId});
        }
    });
});

router.post('/makeHistorical', (req, res, next) => {
    const { eventid } = req.body;
    const stmt = `UPDATE event SET historical = TRUE WHERE eventid = ${mysql.escape(eventid)}`;
    console.log("event/makeHistorical: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: event state changed!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/update', (req, res, next) => {
    const { eventid, eventname, typeid, budget, eventdate, venueid, numinvitees } = req.body;
    const stmt = `UPDATE event SET `
        + `eventname = ${mysql.escape(eventname)}, typeid = ${mysql.escape(typeid)}, `
        + `budget = ${mysql.escape(budget)}, eventdate = ${mysql.escape(eventdate)}, venueid = ${mysql.escape(venueid)}, `
        + `numinvitees = ${mysql.escape(numinvitees)} `
        + `WHERE eventid = ${mysql.escape(eventid)}`;
    console.log("event/update: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: event updated!");
            res.send({status: 'SUCCESS'});
        }
    });
});

router.post('/delete', (req, res, next) => {
    const { eventid } = req.body;
    const stmt = `DELETE FROM event WHERE eventid = ${mysql.escape(eventid)}`;
    console.log("event/delete: ", stmt);
    connection.query(stmt, (err, results, fields) => {
        if (err) {
            console.log("[!]", err);
            res.send({status: 'FAIL'});
        } else {
            console.log("DB: event deleted!");
            res.send({status: 'SUCCESS'});
        }
    });
});

module.exports = router;
