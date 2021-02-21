const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/db');

let url = 'mongodb://localhost:27017/pbfinaldb';

const mongoose = require("mongoose");
mongoose.set('useCreateIndex',true);
const MongoClient = require('mongodb').MongoClient;
const userModel = require('./database/models/user-schema');
const PORT = 4200;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

const secretKey =
    "b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW \
    QyNTUxOQAAACBvHkpPhNa0KJf2zG+8xbaAoRbkML2/gjJj6wCWiM0rEAAAAJBNgaPVTYGj \
    1QAAAAtzc2gtZWQyNTUxOQAAACBvHkpPhNa0KJf2zG+8xbaAoRbkML2/gjJj6wCWiM0rEA \
    AAAEBW5GWhceQNYAWH+NZMkHCChOmW893UR5ZogFzzS+PFTW8eSk+E1rQol/bMb7zFtoCh \
    FuQwvb+CMmPrAJaIzSsQAAAACmFtYmVyQGhlbGwBAgM=";

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, dbHandler)=>{
        if(error){
            console.log("Error: Could not connect to database.");
            res.json({
                success: false,
                token: null,
                err: error
            });
        }else{
            dbHandler.db('pbfinaldb').collection('users').findOne({email: email}, (err, result)=>{
                if(err){
                    console.log("Error: No user found with this email.");
                    res.json({
                        success: false,
                        token: null,
                        err: err
                    });
                }else{
                    if(result.email == email && result.password == password){
                        let token = jwt.sign({email: result.email}, secretKey, { expiresIn: 60000 });
                        res.json({
                            success: true,
                            err: null,
                            token
                        });
                    }else{
                        res.json({
                            success: false,
                            token: null,
                            err: err
                        });
                    }
                    dbHandler.close();
                }
            });
        }
    });
});

app.post('/api/signup', (req, res)=>{
    const {username, email, password} = req.body;

    const data = new userModel({
        username: username,
        email: email,
        password: password,
        budgets: []
    });

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, dbHandler)=>{
        if(error){
            console.log("Error: Could not connect to database.");
            console.log(error);
            res.json({success: false});
        }else{
            dbHandler.db('pbfinaldb').collection('users').insertOne(data, (err, result)=>{
                if(err){
                    console.log("Error adding new user to the database.");
                    console.log(err);
                    res.json({success: false});
                }else{
                    res.json({success: true});
                }
            });
        }
    });

});

app.post('/api/budgets', (req, res)=>{
    const {email} = req.body;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, dbHandler)=>{
        if(error){
            console.log("Error: Could not connect to database.");
            res.json({success: false, data: null});
        }else{
            dbHandler.db('pbfinaldb').collection('users').findOne({email: email}, (err, result)=>{
                if(err){
                    console.log("Error: No user found with this email.");
                    res.json({success: false, data: null});
                }else{
                    res.json({success: true, data: result.budgets});
                    dbHandler.close();
                }
            });
        }
    });
});

app.post('/api/add', (req, res) => {
    const {email, title, budget, used} = req.body;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, dbHandler)=>{
        if(error){
            console.log("Error: Could not connect to database.");
            console.log(error);
            res.json({success: false});
        }else{
            dbHandler.db('pbfinaldb').collection('users').findOneAndUpdate({email: email}, {$push: {budgets: {title: title, budget: budget, used: used}}}, (err, result)=>{
                if(err){
                    console.log("Error adding to the database.");
                    console.log(err);
                    res.json({success: false});
                }else{
                    if(result.lastErrorObject.updatedExisting === true){
                        res.json({success: true});
                    }else{
                        res.json({success: false});
                    }
                }
            });
        }
    });
});

app.post('/api/update', (req, res) => {
    const {email, oldTitle, title, budget, used} = req.body;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, dbHandler)=>{
        if(error){
            console.log("Error: Could not connect to database.");
            console.log(error);
            res.json({success: false});
        }else{
            dbHandler.db('pbfinaldb').collection('users').findOneAndUpdate({email: email, "budgets.title": oldTitle}, {$set: {"budgets.$.title": title, "budgets.$.budget": budget, "budgets.$.used": used}}, (err, result)=>{
                if(err){
                    console.log("Error updating the database.");
                    console.log(err);
                    res.json({success: false});
                }else{
                    if(result.lastErrorObject.updatedExisting){
                        res.json({success: true});
                    }else{
                        res.json({success: false});
                    }
                }
            });
        }
    });
});

app.post('/api/delete', (req, res) => {
    const {email, title, budget, used} = req.body;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, dbHandler)=>{
        if(error){
            console.log("Error: Could not connect to database.");
            console.log(error);
            res.json({success: false});
        }else{
            dbHandler.db('pbfinaldb').collection('users').findOneAndUpdate({email: email}, {$pull: {budgets: {title: title, budget: budget, used: used}}}, (err, result)=>{
                if(err){
                    console.log("Error removing from the database.");
                    console.log(err);
                    res.json({success: false});
                }else{
                    if(result.lastErrorObject.updatedExisting){
                        res.json({success: true});
                    }else{
                        res.json({success: false});
                    }
                }
            });
        }
    });
});

app.use(function (err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Email or password is incorrect.'
        });
    }else{
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}...`);
});