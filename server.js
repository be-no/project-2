// DEPENDENCIES
const express = require('express');
const app = express(); // for http route and req/res
const mongoose = require('mongoose'); // for db connection
const Vietfood = require('./models/vietfood.js'); // for rendering mongoose models into database
const methodOverride = require('method-override'); // for delete
require('dotenv').config();

// DATABASE CONNECTION to mongo
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ERROR/SUCCESS feedback from any action
const db = mongoose.connection;
db.on('error', (err) => console.log(`${err.message} MongoDB Not Running!`));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true })); //for objects to be seen as req.body > odm
app.use(express.json());
app.use(methodOverride("_method"));

//INDEX
app.get('/vietfood/', (req, res) => {
    Vietfood.find({}, (err, idxDish) => {
        res.render('index.ejs', {
            vietfood: idxDish,
        });
    });
});

//NEW
app.get('/vietfood/new', (req, res) => {
    res.render('new.ejs');
});

//DELETE
app.delete('/vietfood/:id', (req, res) => {
    Vietfood.findByIdAndRemove(req.params.id, (err, rmDish) => {
        res.redirect('/vietfood/');
    });
});

//UPDATE
app.put('/vietfood/:id', (req, res) => {
    if (req.body.isVeg === 'on') {
        req.body.isVeg = true;
    } else {
        req.body.isVeg = false;
    }
    Vietfood.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedDish) => {
        res.redirect(`/vietfood/${req.params.id}`); //redirects back to index page after edit is complete
    });
});

//CREATE
app.post('/vietfood/', (req, res) => {
    if (req.body.isVeg === 'on') { //if checked, isVeg === 'on'
        req.body.isVeg = true;
    } else { //if not checked, isVeg is undefined
        req.body.isVeg = false;
    }
    Vietfood.create(req.body, (err, mkDish) => { //references to Vietfood model
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.redirect('/vietfood/');
        }
    });
});

//EDIT
app.get('/vietfood/:id/edit', (req, res) => {
    Vietfood.findById(req.params.id, (err, editDish) => {
        res.render('edit.ejs', {
            dish: editDish,
        });
    });
});

//SHOW
app.get('/vietfood/:id', (req, res) => {
    Vietfood.findById(req.params.id, (err, showDish) => {
        res.render('show.ejs', {
            dish: showDish,
        });
    });
});

// PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server.js listening on port ${PORT}`);
});