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
    console.log('DB connected');
});

// ---------------------------------

router.get('/event/list', (req, res, next) => {
    let statement =
        "SELECT CONCAT(c.FName,c.LName) as Name, t.TypeName, Budget, v.Name, v.Address, EventDate, NumInvitees" +
        "FROM Client c, Event e, EventType t, Venue v" +
        "WHERE c.ClientID=e.ClientID AND e.TypeID=t.TypeID AND v.VenueID=e.VenueID";
    connection.query(statement, (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    });
});

// TODO: add more

module.exports = router;
