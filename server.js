const express = require('express');
//const req = require('express/lib/request');
const app = express();
// const res = require('express/lib/response');
const mysql = require('mysql');
const _ = require('lodash');
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends: true}))


app.listen(3000, () => console.log('Server is running on port 3000'));

app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'mysql_nodejs',
    port: '3306'
});


connection.connect(function(err){
    if(err) throw err;
    console.log("Connected to MYSQL database is success")
})
// connection.connect(function (err) {
//     if (err) {
//         console.log("Error Connected to MYSQL database ", err);
//     }
//     console.log("Connected to MYSQL database is success");
// });

//create routes
//--------------------------------------------version 1--------------------------------------------
app.post("/create", async (req, res) => {
    const { email, name, password } = req.body

    try {
        connection.query(
            "INSERT INTO users(email, fullname,password)VALUES(?,?,?)",
            [email, name, password],
            (err, result, fields) => {
                if(resp){
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'Success'
                    
                    })
                }else{
                    console.log('ERR 2: bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad : bad sql',
                        Log: 2
                    })
                }
            }
        )
    } catch (error) {
        console.log('ERR 0', error );
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})
//--------------------------------------------version 2--------------------------------------------
// app.post("/api/createmovie", async (req, res) => {
    
//     var moviename = _.get(req, ['body', 'moviename']);
//     var mill = _.get(req, ['body', 'mill']);
//     try {
//         if (usersname && password) {
//             connection.query('insert into tbl_movie (moviename,mill)values (?,?)',[
//                 moviename,mill
//             ],(err,resp,fields)=>{
//                 if(resp){
//                     return res.status(200).json({
//                         RespCode: 200,
//                         RespMessage: 'Success'
                    
//                     })
//                 }else{
//                     console.log('ERR 2: bad sql')
//                     return res.status(200).json({
//                         RespCode: 400,
//                         RespMessage: 'bad : bad sql',
//                         Log: 2
//                     })
//                 }
//             })
//         } else {
//             console.log('ERR 1: INVALID request')
//             return res.status(200).json({
//                 RespCode: 400,
//                 RespMessage: 'bad : INVALID request',
//                 Log: 1
//             })
//         }
//     } catch (error) {
//         console.log('ERR 0', error );
//         return res.status(200).json({
//             RespCode: 400,
//             RespMessage: 'bad',
//             Log: 0
//         })
//     }
// })
// //read

app.get("/read", async (req, res) => {
    try {
        connection.query("SELECT * FROM users", (err, result, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(result);
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

    

//read single user form db แสดงแค่ email
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email;

    try {
        connection.query("SELECT * FROM users WHERE email = ?", [email], (err, result, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(result);
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

//update data
app.patch("/update/:email" , async (req,res) =>{
    const email = req.params.email;
    const newPassword = req.body.newPassword;
    try {
        connection.query("UPDATE users SET password = ? WHERE email = ?", [newPassword ,email], (err, result, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({message: "User password updated successfully"});
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})
//delete
app.delete("/delete/:email", async (req,res) => {
    const email = req.params.email;
    try {
        connection.query("DELETE FROM users WHERE email = ?", [email], (err, result, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (result.affectedRows ===0){
                return res.status(404).json({ message: "No user with the email" });
            }
            return res.status(200).json({ message: "User deleted successfully" });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})


module.exports = app;