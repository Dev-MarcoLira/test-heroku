const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');
const bodyparser = require('body-parser');

//Configuring express server
app.use(bodyparser.json());

app.get('/', (req, res) => {

    res.send("Hello")

})

//MySQL details
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'marcopcg',
    password: 'marcopcg',
    database: 'academy',
    multipleStatements: true
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

//Router to GET specific learner detail from the MySQL database
app.get('/learners/:id' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learner WHERE learner_id = ?',[req.params.id], (err, rows, fields) => {
    if (!err)
       res.send(rows);
    else
        console.log(err);
    })
});

//Router to INSERT/POST a learner's detail
app.post('/learners', (req, res) => {
    let learner = req.body;
    const sql = "INSERT INTO learner (name, gender, age) VALUES ( ?, ?, ? );"
    mysqlConnection.query(sql, [learner.learner_name, learner.learner_gender, learner.learner_age], (err, rows, fields) => {
    if (!err)
        rows.forEach(element => {
    if(element.constructor == Array)
        res.send('New Learner ID : '+ element[0].id);
    });
    else
        console.log(err);
    })
});

//Router to UPDATE a learner's detail
app.put('/learners', (req, res) => {
    let learner = req.body;
    const sql = "UPDATE learner SET name = ?, gender = ?, age = ? WHERE id = ?";
    mysqlConnection.query(sql, [learner.learner_name, learner.learner_gender, learner.learner_age, learner.learner_id], (err, rows, fields) => {
    if (!err)
        res.send('Learner Details Updated Successfully');
    else
        console.log(err);
    })
});

//Router to DELETE a learner's detail
app.delete('/learners/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM learner WHERE id = ?', [req.params.id], (err, rows, fields) => {
    if (!err)
        res.send('Learner Record deleted successfully.');
    else
        console.log(err);
    })
});

app.listen(PORT)