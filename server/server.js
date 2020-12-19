const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/db');

let url = 'mongodb://localhost:27017/pbfinaldb';

const mongoose = require("mongoose");
const userModel = require('./database/models/user-schema');
const PORT = 4200;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

var stored_email = null;

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        userModel.findOne({email: email}).then((data)=>{
            if(email == data.email && password == data.password) {
                let token = jwt.sign({email: data.email}, secretKey, { expiresIn: 60000 });
                stored_email = data.email;
                res.json({
                    success: true,
                    err: null,
                    token
                });
            } else {
                console.log("Sign-in failed.");
                stored_email = null;
                res.json({
                    success: false,
                    token: null,
                    err: 'Email or password is incorrect.'
                });
            }
            mongoose.connection.close();
        }).catch((error)=>{
            console.log("Email or password is incorrect.");
            res.json({
                success: false,
                token: null,
                err: 'Email or password is incorrect.'
            });
        });
    }).catch((error)=>{
        console.log("Error: could not connect to the database.");
    });
});


app.post('/api/add', (req, res) => {
    const { title, budget, used} = req.body;
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        let update = {budget: {$push: {title: title, budget: budget, used: used}}}
        userModel.updateOne({email: stored_email}, update).then((data)=>{
            res.json({success: true});
            mongoose.connection.close();
        }).catch((error)=>{
            console.log("Error: could not add to database.");
            res.json({
                success: false,
                err: 'Error adding budget to the database.'
            });
        });
    }).catch((error)=>{
        console.log("Error: could not connect to the database.");
    });
});














app.post('/api/signup', (req, res)=>{
    const {username, email, password} = req.body;

    //budgets - add unique starting entry to prevent duplicate key error caused
    //by more than one empty array in database
    const data = new userModel({
        username: username,
        email: email,
        password: password,
        budgets: [{title: email, budget: 0, used: 0}]  
    });

    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        userModel.insertMany(data).then((data)=>{
            res.json({success: true});
            mongoose.connection.close();
        }).catch((error)=>{
            console.log("Unable to insert data into collection. ");
        });
    }).catch((error)=>{
        console.log("Error: could not connect to the database.");
    });
});

app.get('/api/budgets', (req, res)=>{
    if(stored_email){
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            userModel.findOne({email: stored_email}).then((data)=>{
                res.json({success: true, data: data.budgets});
                mongoose.connection.close();
            }).catch((error)=>{
                res.json({success: false});
            });
        }).catch((error)=>{
            console.log("Error: could not connect to the database.");
        });
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true
    });
});

app.use(function (err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Email or password is incorrect.'
        });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});