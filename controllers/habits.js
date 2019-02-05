require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');


router.get('/', (req, res) => {
    db.Habit.find({ user: req.user.id })
    .then(habits => {
        res.render('')
    })
    .catch(err => {
        console.log('error habits/dashoboard GET Route', err)
    })
})

router.post('/', (req, res) => {
    db.Habit.create(req.body)
    .then(habit => {
        res.redirect('')
    })
    .catch(err => {
        console.log('error in /habit/POST Route', err)
    })
})


router.put('/:name', (req, res) => {
    db.Habit.findOneAndUpdate({ 
        name: req.body.habit.name }, 
        req.body, { new: true })
    .then(habit => {
        res.send(habit)
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({message: 'Server Error'})
    });
})

router.put('/', (req, res) => {
    db.Habit.findOneAndUpdate(
        { user.ref: user.id }, 
         { $push: { days: req.date, completions: req.completions, notes: req.notes }
    })
    .then()
    .catch()
})

router.delete('/', (req, res) => {
    db.Habits.findOneAndDelete({ name: req.body.habit.name })
    .then()
    .catch
})


module.exports = router;