/**
 * Created by deepak on 31/05/15.
 */

var express = require('express'),
    _ = require('underscore'),
    bodyParser = require('body-parser'),
    app = express(),

    mongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/expressdemo',
    port = 3000,
    _db;

mongoClient.connect(url, function(err, db) {
    if(err) {
        console.log('error in connecting to mongoDB ', err);
    } else {
        _db = db;
        console.log('connected to mongoDB');
        app.listen(port, function() {
            console.log('listening for requests on localhost:%s', port);
        });
    }
});

app.use(bodyParser.json());

app.get('/users', function(req, res) {
    var users = _db.collection('users');
    users.find({}).toArray(function (err, users) {
        if(err) {
            console.log('error in fetching users ', err);
        } else {
            res.send(users);
        }
    });
});


app.get('/users/:name', function(req, res) {
    var name = req.params.name;
    var users = _db.collection('users');
    users.find({ 'name' : name }).toArray(function(err, user) {
        res.send(user);
    });
});


app.post('/users', function(req, res) {
    var user = req.body;
    var users = _db.collection('users');
    users.save(user, function(err, users) {
        res.json(users);
    });
});


app.put('/users/:name', function(req, res) {
    var name = req.params.name,
        newName = req.body.name;
    var users = _db.collection('users');
    users.updateOne({ 'name' : name }, { 'name' : newName }, function (err, user) {
        res.send(user);
    })
});


app.delete('/users/:name', function(req, res) {
    var name = req.params.name;
    var users = _db.collection('users');
    users.removeOne({'name' : name}, function (err, user) {
        res.send(user);
    });
});